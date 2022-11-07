import * as fs from 'fs';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { MulterService } from '@bregenz-bewegt/server/multer';
import {
  PatchPreferencesDto,
  PatchProfileDto,
} from '@bregenz-bewegt/shared/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DifficultyType, Preferences, User } from '@prisma/client';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private multerService: MulterService
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
      include: { difficulties: { select: { difficulty: true } } },
    });

    return {
      ...preferences,
      difficulties: preferences.difficulties.map((d) => d.difficulty),
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
        profilePicture: `${file.filename}`,
      },
    });
  }

  async getProfilePicture(id: User['id'], res: Response): Promise<void> {
    const user = await this.findById(id);

    if (!this.uploadedProfilePictureExists(user.profilePicture)) {
      throw new NotFoundException();
    }

    const filePath = this.multerService.getProfilePicturePath(
      user.profilePicture
    );

    return res.sendFile(filePath);
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
