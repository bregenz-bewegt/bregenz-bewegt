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
  search<Schema extends Configuration<PropertiesSchema>['schema']>(
    schema: Schema,
    docs: ResolveSchema<PropertiesSchema>[],
    query: SearchParams<Schema>
  ): SearchResult<Schema> {
    const db = create({ schema });
    insertBatch(db, docs);

    const result = search(db, query);
    return result;
  }
}
