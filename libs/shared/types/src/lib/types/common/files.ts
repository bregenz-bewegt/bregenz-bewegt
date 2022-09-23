export type ValidProfilePictureFileExtension = 'jpeg' | 'jpg' | 'png' | 'gif';
export type ValidProfilePictureMimeType =
  `image/${ValidProfilePictureFileExtension}`;

export const validFileExtensions: ValidProfilePictureFileExtension[] = [
  'jpeg',
  'jpg',
  'png',
  'gif',
];
export const valideMimeTypes: ValidProfilePictureMimeType[] = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
];
