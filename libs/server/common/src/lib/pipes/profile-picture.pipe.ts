import {
  Injectable,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import * as path from 'path';
import 'multer';
import {
  ValidProfilePictureFileExtension,
  ValidProfilePictureMimeType,
} from '@bregenz-bewegt/shared/types';
import {
  validProfilePictureMimeTypes,
  validProfilePictureFileExtensions,
} from '@bregenz-bewegt/shared/constants';

@Injectable()
export class ProfilePictureValidationPipe
  implements PipeTransform<Express.Multer.File>
{
  private readonly maxFileSize = 10 * 1000 * 1000;

  async transform(file: Express.Multer.File) {
    if (this.validFileExtension(file) && this.validateFileSize(file)) {
      return file;
    }

    throw new UnsupportedMediaTypeException();
  }

  private validateMimeType(file: Express.Multer.File): boolean {
    // return file.mimetype.match(/^(image\/(jpeg|jpg|png|gif))$/)
    return validProfilePictureMimeTypes.includes(
      file.mimetype as ValidProfilePictureMimeType
    );
  }

  private validFileExtension(file: Express.Multer.File): boolean {
    return validProfilePictureFileExtensions.includes(
      path
        .extname(file.originalname)
        .replace('.', '') as ValidProfilePictureFileExtension
    );
  }

  private validateFileSize(file: Express.Multer.File): boolean {
    return file.size < this.maxFileSize;
  }
}
