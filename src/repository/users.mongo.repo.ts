import createDebug from 'debug';
import { User } from '../entities/user.js';
import { RepoSmall } from './repo.interface.js';
import { UserModel } from './user.mongo.model.js';
const debug = createDebug('W6:users_repo');

export class UsersMongoRepo implements RepoSmall<User> {
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
    debug('create');
    const data = await UserModel.create(info);
    return data;
  }

  async search(query: { key: string; value: unknown }) {
    debug('search');
    const data = await UserModel.find({ [query.key]: query.value });
    return data;
  }
}
