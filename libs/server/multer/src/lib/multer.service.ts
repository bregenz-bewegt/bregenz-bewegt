import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { diskStorage, DiskStorageOptions } from 'multer';

@Injectable()
export class MulterService {
  static destinations = { profilePictures: 'profile-pictures' } as const;
  destinations = MulterService.destinations;

  static getStorage(filename: DiskStorageOptions['filename'], path?: string) {
    return diskStorage({
      destination: `./static/${process.env['NX_UPLOADS_FOLDER']}${
        path ? `/${path}` : ''
      }`,
      filename,
    });
  }

  getProfilePicturePath(filename: string) {
    return path.join(
      process.cwd(),
      './static/',
      process.env['NX_UPLOADS_FOLDER'] ?? 'uploads',
      `${this.destinations.profilePictures}`,
      filename
    );
  }

  async deleteProfilePicture(filename: string) {
    const path = this.getProfilePicturePath(filename);
    return this.deleteFile(path);
  }

  private async deleteFile(path: string) {
    return util.promisify(fs.unlink)(path);
  }
}
