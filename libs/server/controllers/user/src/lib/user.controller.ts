import {
  GetCurrentUser,
  HasRole,
  RemoveSensitiveFieldsInterceptor,
  RoleGuard,
} from '@bregenz-bewegt/server/common';
import { PatchProfileDto } from '@bregenz-bewegt/shared/types';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
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
import { Role, User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get('profile')
  getUser(@GetCurrentUser('sub') userId: string): Promise<User> {
    return this.userService.findById(userId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Patch('profile')
  patchProfile(
    @GetCurrentUser('sub') userId: string,
    @Body() dto: PatchProfileDto
  ): Promise<User> {
    return this.userService.patchProfile(userId, dto);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @UseInterceptors(
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
    @GetCurrentUser('sub') id,
    @UploadedFile()
    file: // new ParseFilePipe({
    //   validators: [new FileTypeValidator({ fileType: 'png' })],
    // })
    Express.Multer.File
  ): Promise<User> {
    return this.userService.editProfilePicture(id, file);
  }

  @Get('profile-picture')
  async getProfilePicture(
    @GetCurrentUser('sub') id,
    @Res() res: Response
  ): Promise<void> {
    return this.userService.getProfilePicture(id, res);
  }
}
