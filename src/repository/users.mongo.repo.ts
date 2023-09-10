import createDebug from 'debug';
import { User } from '../entities/user.js';
import { HTTPError } from '../errors/custom.error.js';
import { RepoUser } from './repo.interface.js';
import { UserModel } from './user.mongo.model.js';
const debug = createDebug('FP:users_repo');

export class UsersMongoRepo implements RepoUser<User> {
  private static instance: UsersMongoRepo;

  public static getInstance(): UsersMongoRepo {
    if (!UsersMongoRepo.instance) {
      UsersMongoRepo.instance = new UsersMongoRepo();
    }

    return UsersMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiate');
  }

  async create(info: Partial<User>): Promise<User> {
    debug('createeeee');
    const nameData = await UserModel.findOne({ name: info.name });

    const emailData = await UserModel.findOne({ email: info.email });

    if (emailData || nameData)
      throw new HTTPError(
        500,
        'Email already exists',
        'ID not found in queryID'
      );
    const data = await UserModel.create(info);
    debug(data);
    return data;
  }

  async search(query: { key: string; value: unknown }) {
    debug('search');
    const data = await UserModel.find({ [query.key]: query.value });
    return data;
  }

  async queryId(id: string): Promise<User> {
    debug('queryId');
    const data = await UserModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in queryID');
    return data;
  }

  async update(info: Partial<User>): Promise<User> {
    debug('update');
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');
    return data;
  }
}
