import createDebug from 'debug';
import { Euphonium } from '../entities/euphonium.js';
import { HTTPError } from '../errors/custom.error.js';
import { EuphoniumModel } from './euphonium.mongo.model.js';
import { RepoEuph } from './repo.interface.js';
const debug = createDebug('FP:euphoniums_repo');

export class EuphoniumsMongoRepo implements RepoEuph<Euphonium> {
  private static instance: EuphoniumsMongoRepo;

  public static getInstance(): EuphoniumsMongoRepo {
    if (!EuphoniumsMongoRepo.instance) {
      EuphoniumsMongoRepo.instance = new EuphoniumsMongoRepo();
    }

    return EuphoniumsMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiate');
  }

  async query(): Promise<Euphonium[]> {
    debug('query');
    const data = await EuphoniumModel.find()
      .populate('creator', { euphoniums: 0 })
      .exec();
    return data;
  }

  async queryFiltered(
    offset: string,
    filterValue: string,
    filterCategory: string
  ): Promise<Euphonium[]> {
    debug('queryFiltered');
    const filter: Record<string, string> = {};
    filter[filterCategory] = filterValue;
    const limit = 8;
    const data = await EuphoniumModel.find(filter)
      .sort({ _id: -1 })
      .limit(limit)
      .skip(limit * Number(offset) - limit)
      .populate('creator', { euphoniums: 0 })
      .exec();
    if (!data)
      throw new HTTPError(404, 'Not found', 'Filter o pagination not valid');
    return data;
  }

  async queryPaginated(offset: string): Promise<Euphonium[]> {
    debug('queryPaginated');
    const limit = 8;
    const data = await EuphoniumModel.find()
      .sort({ _id: -1 })
      .limit(limit)
      .skip(limit * Number(offset) - limit)
      .populate('creator', { euphoniums: 0 })
      .exec();
    if (!data) throw new HTTPError(404, 'Not found', 'Pagination not valid');
    return data;
  }

  async queryId(id: string): Promise<Euphonium> {
    debug('queryId');
    const data = await EuphoniumModel.findById(id)
      .populate('creator', { euphoniums: 0 })
      .exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in queryID');
    return data;
  }

  async search(query: { key: string; value: unknown }) {
    debug('search');
    const data = await EuphoniumModel.find({ [query.key]: query.value })
      .populate('creator')
      .exec();
    return data;
  }

  async create(info: Partial<Euphonium>): Promise<Euphonium> {
    const data = (await EuphoniumModel.create(info)).populate('creator');
    return data;
  }

  async update(info: Partial<Euphonium>): Promise<Euphonium> {
    debug('update');
    const data = await EuphoniumModel.findByIdAndUpdate(info.id, info, {
      new: true,
    })
      .populate('creator', { euphoniums: 0 })
      .exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');
    return data;
  }

  async remove(id: string): Promise<void> {
    debug('destroy');
    const data = await EuphoniumModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Remove not possible: id not found'
      );
  }
}
