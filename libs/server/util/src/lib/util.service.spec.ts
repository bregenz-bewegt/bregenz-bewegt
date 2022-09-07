import { Test } from '@nestjs/testing';
import { UtilService } from './util.service';

describe('ServerUtilService', () => {
  let service: UtilService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UtilService],
    }).compile();

    service = module.get(UtilService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
