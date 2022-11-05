import { Test } from '@nestjs/testing';
import { ActivityService } from './activity.service';

describe('ActivityService', () => {
  let service: ActivityService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ActivityService],
    }).compile();

    service = module.get(ActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
