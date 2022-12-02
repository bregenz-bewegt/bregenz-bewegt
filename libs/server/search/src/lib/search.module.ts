import { Global, Module } from '@nestjs/common';
import { SearchService } from './search.service';

@Global()
@Module({
  controllers: [],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
