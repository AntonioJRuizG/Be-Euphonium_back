export interface RepoEuph<T> {
  query(): Promise<T[]>;
  queryId(id: string): Promise<T>;
  queryPaginated(offset: string): Promise<T[]>;
  queryFiltered(
    offset: string,
    filterValue: string,
    filterCategory: string
  ): Promise<T[]>;
  search(query: { key: string; value: unknown }): Promise<T[]>;
  create(info: Partial<T>): Promise<T>;
  update(info: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
}

export interface RepoUser<T> {
  queryId(id: string): Promise<T>;
  search(query: { key: string; value: unknown }): Promise<T[]>;
  create(info: Partial<T>): Promise<T>;
  update(info: Partial<T>): Promise<T>;
}
