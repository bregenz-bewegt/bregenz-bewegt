import * as fs from 'fs';
import * as argon from 'argon2';
import * as speakeasy from 'speakeasy';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { MulterService } from '@bregenz-bewegt/server/multer';
import {
  EmailResetToken,
  JwtPayloadWithoutRole,
  PatchPreferencesDto,
  PatchProfileDto,
  ResetEmailDto,
  VerifyResetEmailDto,
} from '@bregenz-bewegt/shared/types';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DifficultyType,
  FriendRequest,
  Preferences,
  User,
} from '@prisma/client';
import { Prisma } from '@prisma/client';
import { UtilService } from '@bregenz-bewegt/server/util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@bregenz-bewegt/server/mail';
import { resetEmailError } from '@bregenz-bewegt/shared/errors';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private utilService: UtilService,
    private multerService: MulterService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async findSingle(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput
  ): Promise<User> {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async findByEmail(email: User['email']): Promise<User> {
    return this.prismaService.user.findUnique({ where: { email: email } });
  }

  async findById(id: User['id']): Promise<User> {
    return this.prismaService.user.findUnique({ where: { id: id } });
  }

  async findByUsername(username: User['username']): Promise<
    User & {
      preferences: Preferences;
      friendRequestsRelation: FriendRequest[];
    }
  > {
    const result = await this.prismaService.user.findUnique({
      where: { username: username },
      include: {
        preferences: true,
        friendRequestsRelation: true,
      },
    });

    return result;
  }

  async patchProfile(id: User['id'], fields: PatchProfileDto): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        ...fields,
      },
    });
  }

  async deleteProfile(id: User['id']): Promise<User> {
    await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        activities: {
          set: [],
        },
      },
    });
    return this.prismaService.user.delete({
      where: {
        id: id,
      },
      include: { preferences: true },
    });
  }

  async getPreferences(
    id: User['id']
  ): Promise<Preferences & { difficulties: DifficultyType[] }> {
    const preferences = await this.prismaService.preferences.findUnique({
      where: { userId: id },
      include: { difficulties: true },
    });

    return {
      ...preferences,
      difficulties: preferences.difficulties.map(
        (d) => d.difficulty as unknown as DifficultyType
      ),
    };
  }

  async patchPreferences(
    id: User['id'],
    fields: PatchPreferencesDto
  ): Promise<Preferences & { difficulties: DifficultyType[] }> {
    const preferences = await this.prismaService.preferences.update({
      where: {
        userId: id,
      },
      data: {
        ...(fields.public !== undefined && {
          public: fields.public,
        }),
        ...(fields.difficulties !== undefined && {
          difficulties: {
            connect: (
              await this.prismaService.difficulty.findMany({
                where: { difficulty: { in: fields.difficulties } },
              })
            ).map((d) => ({ id: d.id })),
            disconnect: (
              await this.prismaService.difficulty.findMany({
                where: { difficulty: { notIn: fields.difficulties } },
              })
            ).map((d) => ({ id: d.id })),
          },
        }),
      },
      include: {
        difficulties: true,
      },
    });

    return {
      ...preferences,
      difficulties: preferences.difficulties.map((d) => d.difficulty),
    };
  }

  async resetEmail(
    userId: User['id'],
    dto: ResetEmailDto
  ): Promise<EmailResetToken> {
    const isEmailTaken = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (isEmailTaken) throw new ConflictException(resetEmailError.EMAIL_TAKEN);

    const { token, secret: activationSecret } =
      this.utilService.generateOtpToken();
    const resetToken = await this.signResetEmailToken(userId, dto.email);
    const resetTokenHash = await argon.hash(resetToken);

    const newUser = await this.prismaService.user.update({
      where: { id: userId },
      data: { activationSecret, emailResetToken: resetTokenHash },
    });

    this.mailService.sendOtpActivationMail({
      to: dto.email,
      otp: token,
      name: newUser.firstname ?? newUser.username,
    });

    return { token: resetToken };
  }

  async verifyResetEmail(
    userId: User['id'],
    token: string,
    dto: VerifyResetEmailDto
  ): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.emailResetToken) {
      throw new ForbiddenException('Access denied');
    }

    const tokenValid = await argon.verify(user.emailResetToken, token);
    const otpValid = speakeasy.totp.verify({
      secret: user.activationSecret,
      encoding: 'base32',
      token: dto.token,
      window: 2,
    });

    if (!tokenValid || !otpValid) {
      throw new ForbiddenException('Access denied');
    }

    const decoded = (await this.jwtService.decode(
      token
    )) as JwtPayloadWithoutRole;

    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        email: decoded.email,
        activationSecret: null,
        emailResetToken: null,
      },
    });
  }

  async signResetEmailToken(userId: string, email: string): Promise<string> {
    const jwtPayload: JwtPayloadWithoutRole = {
      sub: userId,
      email,
    };

    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '15m',
      secret: this.configService.get('NX_JWT_EMAIL_RESET_TOKEN_SECRET'),
    });

    return token;
  }

  async editProfilePicture(
    id: User['id'],
    file: Express.Multer.File
  ): Promise<User> {
    const user = await this.findById(id);

    if (this.uploadedProfilePictureExists(user.profilePicture)) {
      await this.multerService.deleteProfilePicture(user.profilePicture);
    }

    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        profilePicture: `${MulterService.destinations.profilePictures}/${file.filename}`,
      },
    });
  }

  async deleteProfilePicture(id: User['id']): Promise<User> {
    const user = await this.findById(id);

    if (!this.uploadedProfilePictureExists(user.profilePicture)) {
      throw new NotFoundException();
    }

    await this.multerService.deleteProfilePicture(user.profilePicture);

    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        profilePicture: null,
      },
    });
  }

  uploadedProfilePictureExists(filename: string): boolean {
    if (!filename) return false;

    const filePath = this.multerService.getProfilePicturePath(filename);

    return fs.existsSync(filePath);
  }
}
