import {
  GetCurrentUser,
  HasRole,
  ProfilePictureValidationPipe,
  RemoveSensitiveFieldsInterceptor,
  RoleGuard,
} from '@bregenz-bewegt/server/common';
import {
  PatchPreferencesDto,
  PatchProfileDto,
  UpdateEmailDto,
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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MulterService } from '@bregenz-bewegt/server/multer';
import { Response } from 'express';
import { Role, User, Preferences } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get('profile')
  getUser(@GetCurrentUser('sub') userId: User['id']): Promise<User> {
    return this.userService.findById(userId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Patch('profile')
  patchProfile(
    @GetCurrentUser('sub') userId: User['id'],
    @Body() dto: PatchProfileDto
  ): Promise<User> {
    return this.userService.patchProfile(userId, dto);
  }

  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Delete('profile')
  deleteProfile(@GetCurrentUser('sub') userId: User['id']): Promise<User> {
    return this.userService.deleteProfile(userId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get('preferences')
  getPreferences(
    @GetCurrentUser('sub') userId: User['id']
  ): Promise<Preferences> {
    return this.userService.getPreferences(userId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Patch('preferences')
  patchPreferences(
    @GetCurrentUser('sub') userId: User['id'],
    @Body() dto: PatchPreferencesDto
  ): Promise<Preferences> {
    return this.userService.patchPreferences(userId, dto);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Put('email')
  updateEmail(
    @GetCurrentUser('sub') userId: User['id'],
    @Body() dto: UpdateEmailDto
  ): Promise<any> {
    return this.userService.updateEmail(userId, dto);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(
    RemoveSensitiveFieldsInterceptor,
    FileInterceptor('file', {
      storage: MulterService.getStorage((req, file, cb) => {
        const filename = `${uuidv4()}`;
        const extension = path.parse(file.originalname).ext;

        cb(null, `${filename}${extension}`);
      }, MulterService.destinations.profilePictures),
    })
  )
  @Post('profile-picture')
  editProfilePicture(
    @GetCurrentUser('sub') userId: User['id'],
    @UploadedFile(ParseFilePipe, ProfilePictureValidationPipe)
    file: Express.Multer.File
  ): Promise<User> {
    return this.userService.editProfilePicture(userId, file);
  }

  @Get('profile-picture')
  getProfilePicture(
    @GetCurrentUser('sub') userId: User['id'],
    @Res() res: Response
  ): Promise<void> {
    return this.userService.getProfilePicture(userId, res);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @Delete('profile-picture')
  deleteProfilePicture(
    @GetCurrentUser('sub') userId: User['id']
  ): Promise<User> {
    return this.userService.deleteProfilePicture(userId);
  }
}
