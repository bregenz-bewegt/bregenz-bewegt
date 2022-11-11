import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const deleteAllProfileImg = async () => {
  const imgPath = path.join(
    process.cwd(),
    `${process.env['NX_API_UPLOADS_FOLDER']}/profile-pictures`
  );

  const allImg = await util.promisify(fs.readdir)(imgPath);

  allImg.forEach(
    async (f) => await util.promisify(fs.unlink)(path.join(imgPath, f))
  );
};

const main = async () => {
  await prisma.activity.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.coordinates.deleteMany();
  await prisma.park.deleteMany();
  await prisma.difficulty.deleteMany();
  await prisma.preferences.deleteMany();
  await prisma.user.deleteMany();
  await deleteAllProfileImg();
};

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
