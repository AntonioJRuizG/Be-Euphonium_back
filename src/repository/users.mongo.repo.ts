import createDebug from 'debug';
import { User } from '../entities/user.js';
import { UserModel } from './user.mongo.model.js';
const debug = createDebug('W6:users_repo');

export class UsersMongoRepo {
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
}
