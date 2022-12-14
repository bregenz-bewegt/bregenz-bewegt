import {
  EmailResetTokenGuard,
  GetCurrentUser,
  HasRole,
  MapProfilePictureInterceptor,
  ProfilePictureValidationPipe,
  Public,
  RemoveSensitiveFieldsInterceptor,
  RoleGuard,
} from '@bregenz-bewegt/server/common';
import {
  EmailResetToken,
  PatchPreferencesDto,
  PatchProfileDto,
  ResetEmailDto,
  VerifyResetEmailDto,
} from '@bregenz-bewegt/shared/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MulterService } from '@bregenz-bewegt/server/multer';
import { Role, User, Preferences } from '@prisma/client';
import { UtilService } from '@bregenz-bewegt/server/util';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private utilService: UtilService
  ) {}

  @UseInterceptors(
    RemoveSensitiveFieldsInterceptor,
    new MapProfilePictureInterceptor()
  )
  @Get('profile')
  getUser(@GetCurrentUser('sub') userId: User['id']): Promise<User> {
    return this.userService.findById(userId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(
    RemoveSensitiveFieldsInterceptor,
    new MapProfilePictureInterceptor()
  )
  @Patch('profile')
  patchProfile(
    @GetCurrentUser('sub') userId: User['id'],
    @Body() dto: PatchProfileDto
  ): Promise<User> {
    return this.userService.patchProfile(userId, dto);
  }

  @UseInterceptors(
    RemoveSensitiveFieldsInterceptor,
    new MapProfilePictureInterceptor()
  )
  @Delete('profile')
  deleteProfile(@GetCurrentUser('sub') userId: User['id']): Promise<User> {
    return this.userService.deleteProfile(userId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @Get('preferences')
  getPreferences(
    @GetCurrentUser('sub') userId: User['id']
  ): Promise<Preferences> {
    return this.userService.getPreferences(userId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @Patch('preferences')
  patchPreferences(
    @GetCurrentUser('sub') userId: User['id'],
    @Body() dto: PatchPreferencesDto
  ): Promise<Preferences> {
    return this.userService.patchPreferences(userId, dto);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @Put('email')
  resetEmail(
    @GetCurrentUser('sub') userId: User['id'],
    @Body() dto: ResetEmailDto
  ): Promise<EmailResetToken> {
    return this.userService.resetEmail(userId, dto);
  }

  @Public()
  @UseGuards(EmailResetTokenGuard)
  @UseInterceptors(
    RemoveSensitiveFieldsInterceptor,
    new MapProfilePictureInterceptor()
  )
  @Post('email/verify')
  verifyResetEmail(
    @Headers('authorization') authorization: string,
    @GetCurrentUser('sub') id: User['id'],
    @Body() dto: VerifyResetEmailDto
  ): Promise<User> {
    const token = this.utilService.extractBearerToken(authorization);
    return this.userService.verifyResetEmail(id, token, dto);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(
    RemoveSensitiveFieldsInterceptor,
    new MapProfilePictureInterceptor(),
    FileInterceptor('file', {
      storage: MulterService.getStorage((req, file, cb) => {
        const filename = `${uuidv4()}`;
        const extension = path.parse(file.originalname).ext;

        cb(null, `${filename}${extension}`);
      }, MulterService.destinations.profilePictures),
    })
  )
  @Put('profile-picture')
  editProfilePicture(
    @GetCurrentUser('sub') userId: User['id'],
    @UploadedFile(ParseFilePipe, ProfilePictureValidationPipe)
    file: Express.Multer.File
  ): Promise<User> {
    return this.userService.editProfilePicture(userId, file);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @Delete('profile-picture')
  @UseInterceptors(
    RemoveSensitiveFieldsInterceptor,
    new MapProfilePictureInterceptor()
  )
  deleteProfilePicture(
    @GetCurrentUser('sub') userId: User['id']
  ): Promise<User> {
    return this.userService.deleteProfilePicture(userId);
  }
}
