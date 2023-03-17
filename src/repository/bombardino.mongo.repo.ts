import createDebug from 'debug';
import { Bombardino } from '../entities/bombardino.js';
import { HTTPError } from '../errors/custom.error.js';
import { BombardinoModel } from './bombardino.mongo.model.js';
import { Repo } from './repo.interface.js';
const debug = createDebug('W6:bombardinos_repo');

export class BombardinosMongoRepo implements Repo<Bombardino> {
  private static instance: BombardinosMongoRepo;

  public static getInstance(): BombardinosMongoRepo {
    if (!BombardinosMongoRepo.instance) {
      BombardinosMongoRepo.instance = new BombardinosMongoRepo();
    }

    return BombardinosMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiate');
  }

  async query(): Promise<Bombardino[]> {
    debug('query');
    const data = await BombardinoModel.find()
      .populate('creator', { bombardinos: 0 })
      .exec();
    return data;
  }

  async queryId(id: string): Promise<Bombardino> {
    debug('queryId');
    const data = await BombardinoModel.findById(id)
      .populate('creator', { bombardinos: 0 })
      .exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in queryID');
    return data;
  }

  async search(query: { key: string; value: unknown }) {
    debug('search');
    const data = await BombardinoModel.find({ [query.key]: query.value })
      .populate('creator', { bombardinos: 0 })
      .exec();
    return data;
  }

  async create(info: Partial<Bombardino>): Promise<Bombardino> {
    debug('create');
    const data = await BombardinoModel.create(info);
    return data;
  }

  async update(info: Partial<Bombardino>): Promise<Bombardino> {
    debug('update');
    const data = await BombardinoModel.findByIdAndUpdate(info.id, info, {
      new: true,
    })
      .populate('creator', { bombardinos: 0 })
      .exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');
    return data;
  }

  async remove(id: string): Promise<void> {
    debug('destroy');
    const data = await BombardinoModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Remove not possible: id not found'
      );
  }
}