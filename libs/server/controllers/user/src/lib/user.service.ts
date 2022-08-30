import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { MulterService } from '@bregenz-bewegt/server/multer';
import { PatchProfileDto } from '@bregenz-bewegt/shared/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private multerService: MulterService
  ) {}

  async getAll() {
    return this.prismaService.user.findMany();
  }

  async getByEmail(email: User['email']) {
    return this.prismaService.user.findUnique({ where: { email: email } });
  }

  async getById(id: User['id']) {
    return this.prismaService.user.findUnique({ where: { id: id } });
  }

  async patchProfile(id: User['id'], fields: PatchProfileDto) {
    return this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        ...fields,
      },
    });
  }

  async editProfilePicture(id: User['id'], file: Express.Multer.File) {
    const user = await this.getById(id);

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

  async getProfilePicture(id: User['id'], res: Response) {
    const user = await this.getById(id);

    if (!this.uploadedProfilePictureExists(user.profilePicture)) {
      throw new NotFoundException();
    }

    const filePath = this.multerService.getProfilePicturePath(
      user.profilePicture
    );

    return res.sendFile(filePath);
  }

  uploadedProfilePictureExists(filename: string) {
    if (!filename) return false;

    const filePath = this.multerService.getProfilePicturePath(filename);

    return fs.existsSync(filePath);
  }
}
