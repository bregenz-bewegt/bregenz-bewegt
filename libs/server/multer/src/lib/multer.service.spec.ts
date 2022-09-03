import { Test } from '@nestjs/testing';
import { MulterService } from './multer.service';

describe('MulterService', () => {
  let service: MulterService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MulterService],
    }).compile();

    service = module.get(MulterService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
