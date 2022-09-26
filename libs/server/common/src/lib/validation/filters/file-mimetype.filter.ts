import { UnsupportedMediaTypeException } from '@nestjs/common';
import 'multer';

export function fileMimetypeFilter(...mimetypes: string[]) {
  return (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void
  ) => {
    if (mimetypes.some((m) => file.mimetype.includes(m))) {
      callback(null, true);
    } else {
      callback(new UnsupportedMediaTypeException(), false);
    }
  };
}
