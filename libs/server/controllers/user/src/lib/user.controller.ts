import {
  GetCurrentUser,
  Public,
  RemoveSensitiveFieldsInterceptor,
} from '@bregenz-bewegt/server/common';
import { PatchProfileDto } from '@bregenz-bewegt/shared/types';
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MulterService } from '@bregenz-bewegt/server/multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get('profile')
  getUser(@GetCurrentUser('sub') userId: string) {
    return this.userService.getById(userId);
  }

  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Patch('profile')
  patchProfile(
    @GetCurrentUser('sub') userId: string,
    @Body() dto: PatchProfileDto
  ) {
    return this.userService.patchProfile(userId, dto);
  }

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
    // new ParseFilePipe({
    //   validators: [new FileTypeValidator({ fileType: 'png' })],
    // })
    file: Express.Multer.File
  ) {
    console.log(file.mimetype);
    return this.userService.editProfilePicture(id, file);
  }

  @Get('profile-picture')
  async getProfilePicture(@GetCurrentUser('sub') id, @Res() res: Response) {
    return this.userService.getProfilePicture(id, res);
  }
}
