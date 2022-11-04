import { Test } from '@nestjs/testing';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

describe('ActivityController', () => {
  let controller: ActivityController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ActivityService],
      controllers: [ActivityController],
    }).compile();

    controller = module.get(ActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
