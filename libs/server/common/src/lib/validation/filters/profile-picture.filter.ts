import {
  ValidProfilePictureFileExtension,
  // ValidProfilePictureMimeType,
} from '@bregenz-bewegt/shared/types';
import * as path from 'path';

const validFileExtensions: ValidProfilePictureFileExtension[] = [
  'jpeg',
  'jpg',
  'png',
  'gif',
];
// const valideMimeTypes: ValidProfilePictureMimeType[] = [
//   'image/jpeg',
//   'image/jpg',
//   'image/png',
//   'image/gif',
// ];
const maxFileSize = 8000;

export function profilePictureFilter(
  req: any,
  file: any,
  callback: (error: Error | null, acceptFile: boolean) => void
) {
  if (
    validFileExtensions.includes(
      path.extname(file.originalname) as ValidProfilePictureFileExtension
    ) &&
    maxFileSize > file.size
  ) {
    return callback(null, true);
  }

  callback(null, false);
}
