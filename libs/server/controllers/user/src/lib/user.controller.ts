import {
  GetCurrentUser,
  RemoveSensitiveFieldsInterceptor,
} from '@bregenz-bewegt/server/common';
import { PatchProfileDto } from '@bregenz-bewegt/shared/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MulterService } from '@bregenz-bewegt/server/multer';
import { Response } from 'express';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get('profile')
  getUser(@GetCurrentUser('sub') userId: User['id']): Promise<User> {
    return this.userService.findById(userId);
  }

  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Patch('profile')
  patchProfile(
    @GetCurrentUser('sub') userId: User['id'],
    @Body() dto: PatchProfileDto
  ): Promise<User> {
    return this.userService.patchProfile(userId, dto);
  }

  @UseInterceptors(
    RemoveSensitiveFieldsInterceptor,
    FileInterceptor('file', {
      storage: MulterService.getStorage((req, file, cb) => {
        const filename = `${path
          .parse(file.originalname)
          .name.replace(/\s/g, '')}_${uuidv4()}`;
        const extension = path.parse(file.originalname).ext;

        cb(null, `${filename}${extension}`);
      }, MulterService.destinations.profilePictures),
    })
  )
  @Post('profile-picture')
  editProfilePicture(
    @GetCurrentUser('sub') userId: User['id'],
    @UploadedFile()
    file: // new ParseFilePipe({
    //   validators: [new FileTypeValidator({ fileType: 'png' })],
    // })
    Express.Multer.File
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

  @Delete('profile-picture')
  deleteProfilePicture(
    @GetCurrentUser('sub') userId: User['id']
  ): Promise<User> {
    return this.userService.deleteProfilePicture(userId);
  }
}
