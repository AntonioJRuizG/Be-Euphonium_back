import { UsersMongoRepo } from './users.mongo.repo';
import { User } from '../entities/user';
import { RepoSmall } from './repo.interface';
import { UserModel } from './user.mongo.model';

jest.mock('./user.mongo.model');

describe('Given UsersMongoRepo', () => {
  let repo: RepoSmall<User>;

  beforeEach(() => {
    repo = UsersMongoRepo.getInstance();
  });

  describe('When getInstance is called', () => {
    test('Then it should return a single instance of UsersMongoRepo', () => {
      const repo = UsersMongoRepo.getInstance();
      expect(repo).toBeInstanceOf(UsersMongoRepo);
    });
  });

  describe('When the create method is used', () => {
    test('Then the create method should be called', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue({ email: 'test' });
      const result = await repo.create({ email: 'test' });
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual({ email: 'test' });
    });
  });

  describe('When the search method is used', () => {
    test('Then the search method should be called', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue({ email: 'test-email' });
      const result = await repo.search({ key: 'test', value: 'test-email' });
      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual({ email: 'test-email' });
    });
  });

  describe('When the search method is used', () => {
    test('Then the search method should be called', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue({ email: 'test-email' });
      const result = await repo.search({ key: 'test', value: 'test-email' });
      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual({ email: 'test-email' });
    });
  });

  describe('When the queryId method is used', () => {
    test('Then the findbyid method should be called', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue({
        name: 'test',
        email: 'test-email',
      });
      const result = await repo.queryId('1');
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test', email: 'test-email' });
    });

    test('Then it should throw error if there is no data', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue('');
      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });

  describe('When the update method is used', () => {
    test('Then the findByIdAndUpdate method should be called', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        name: 'test-updated',
        email: 'test-email',
      });
      const result = await repo.update({
        name: 'test',
        email: 'test-email',
      });
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test-updated', email: 'test-email' });
    });

    test('Then it should throw error if there is no data', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);
      expect(async () => repo.update({ email: 'test' })).rejects.toThrow();
    });
  });
});
