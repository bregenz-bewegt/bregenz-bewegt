import { Storage } from '@ionic/storage';

export const storage = new Storage({
  dbKey: 'bregenz-bewegt',
});
storage.create();
