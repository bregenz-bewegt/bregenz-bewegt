import { Test } from '@nestjs/testing';
import { ServerUtilService } from './server-util.service';

describe('ServerUtilService', () => {
  let service: ServerUtilService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerUtilService],
    }).compile();

    service = module.get(ServerUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
