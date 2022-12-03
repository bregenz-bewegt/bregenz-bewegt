import { Injectable } from '@nestjs/common';
import {
  create,
  insertBatch,
  search,
  Configuration,
  PropertiesSchema,
  SearchParams,
  SearchResult,
} from '@lyrasearch/lyra';
import { ResolveSchema } from '@lyrasearch/lyra/dist/esm/src/types';

@Injectable()
export class SearchService {
  async search<Schema extends Configuration<PropertiesSchema>['schema']>(
    schema: Schema,
    docs: ResolveSchema<PropertiesSchema>[],
    query: SearchParams<Schema>
  ): Promise<SearchResult<Schema>['hits']> {
    const db = create({ schema });
    await insertBatch(db, docs);

    const result = search(db, query);
    return result.hits;
  }
}
