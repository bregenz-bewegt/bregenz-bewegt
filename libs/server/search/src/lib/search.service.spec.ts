import { Test } from '@nestjs/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SearchService],
    }).compile();

    service = module.get(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
