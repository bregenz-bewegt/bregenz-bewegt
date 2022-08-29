import { Injectable } from '@nestjs/common';
import { diskStorage, DiskStorageOptions } from 'multer';

@Injectable()
export class MulterService {
  static getStorage(filename: DiskStorageOptions['filename'], path?: string) {
    return diskStorage({
      destination: `${process.env['NX_API_UPLOADS_PATH']}${
        path ? `/${path}` : ''
      }`,
      filename,
    });
  }
}
