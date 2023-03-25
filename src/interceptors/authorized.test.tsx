import { Response } from 'express';
import { BombardinosMongoRepo } from '../repository/bombardino.mongo.repo';
import { authorized } from './authorized';
import { RequestPlus } from './logged';

const mockBombardinoRepo: BombardinosMongoRepo = {
  queryPaginated: jest.fn(),
  create: jest.fn(),
  query: jest.fn(),
  search: jest.fn(),
  queryId: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const next = jest.fn();
const mockReq = {
  body: {},
  params: { id: '' },
} as unknown as RequestPlus;

const mockRes = {} as Response;

describe('Given authorized function', () => {
  describe('When it is called with req.info and the user is the owner of the euphonium', () => {
    test('Then it should call next()', async () => {
      mockReq.info = { id: 'test-user-id', email: 'test', role: 'test' };
      mockReq.params.id = 'Euphonium-id';
      (mockBombardinoRepo.queryId as jest.Mock).mockReturnValue({
        id: '1',
        manufacturer: 'test',
        creator: { id: 'test-user-id' },
      });
      await authorized(mockReq, mockRes, next, mockBombardinoRepo);
      expect(next).toBeCalled();
    });
  });

  describe('When it is called and req.info is undefined', () => {
    test('Then it should throw HTTPError', async () => {
      mockReq.info = undefined;
      mockReq.params.id = 'Euphonium-id';
      (mockBombardinoRepo.queryId as jest.Mock).mockReturnValue({
        id: '1',
        manufacturer: 'test',
        creator: { id: 'test-user-id' },
      });
      await authorized(mockReq, mockRes, next, mockBombardinoRepo);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When it is called with req.info but the user is not the owner of the euphonium', () => {
    test('Then it should throw HTTPError', async () => {
      mockReq.info = { id: 'test-user1-id', email: 'test', role: 'test' };
      mockReq.params.id = 'Euphonium-id';
      (mockBombardinoRepo.queryId as jest.Mock).mockReturnValue({
        id: '1',
        manufacturer: 'test',
        creator: { id: 'test-user2-id' },
      });
      await authorized(mockReq, mockRes, next, mockBombardinoRepo);
      expect(next).toHaveBeenCalled();
    });
  });
});
