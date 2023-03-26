import { Request, Response } from 'express';
import { Euphonium } from '../entities/euphonium';
import { User } from '../entities/user';
import { RequestPlus } from '../interceptors/logged';
import { RepoEuph, RepoUser } from '../repository/repo.interface';
import { EuphoniumsController } from './euphoniums.controller';

describe('Given ThingsController', () => {
  const mockRepoUsers: RepoUser<User> = {
    create: jest.fn(),
    search: jest.fn(),
    queryId: jest.fn(),
    update: jest.fn(),
  };

  const mockRepoEuphoniums: RepoEuph<Euphonium> = {
    queryPaginated: jest.fn(),
    queryFiltered: jest.fn(),
    create: jest.fn(),
    query: jest.fn(),
    search: jest.fn(),
    queryId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const req = {
    body: {
      creator: { id: 'test' } as User,
    },
    params: {
      id: 'test',
    },
    info: {
      id: 'test',
    },
    query: {
      skip: 10,
      limit: 10,
    },
  } as unknown as RequestPlus;

  const resp = {
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();

  const controller = new EuphoniumsController(
    mockRepoUsers,
    mockRepoEuphoniums
  );

  describe('Given the get method', () => {
    test('Then queryId should have been called', async () => {
      await controller.get(req, resp, next);
      expect(mockRepoEuphoniums.queryId).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should call next if there are errors', async () => {
      (mockRepoEuphoniums.queryId as jest.Mock).mockRejectedValue(new Error());
      await controller.get(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Given the getAll method', () => {
    test('Then query should be called', async () => {
      await controller.getAll(req, resp, next);
      expect(mockRepoEuphoniums.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should call next if there are errors', async () => {
      (mockRepoEuphoniums.query as jest.Mock).mockRejectedValue(new Error());
      await controller.getAll(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Given the getPaginated method', () => {
    test('Then queryPaginated should be called', async () => {
      await controller.getPaginated(req, resp, next);
      expect(mockRepoEuphoniums.queryPaginated).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should call next if there are errors', async () => {
      (mockRepoEuphoniums.queryPaginated as jest.Mock).mockRejectedValue(
        new Error()
      );
      await controller.getPaginated(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Given the getFiltered method', () => {
    test('Then it should call queryFiltered and resp.json', async () => {
      await controller.getFiltered(req, resp, next);
      expect(mockRepoEuphoniums.queryFiltered).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then next should have been called if there are errors', async () => {
      (mockRepoEuphoniums.queryFiltered as jest.Mock).mockRejectedValue(
        new Error()
      );
      await controller.getFiltered(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Given the post method', () => {
    test('Then it should call resp.json if there is req.info.id', async () => {
      (mockRepoUsers.queryId as jest.Mock).mockResolvedValue({
        name: 'test',
        email: 'test',
        euphoniums: [''],
      });
      (mockRepoEuphoniums.create as jest.Mock).mockResolvedValue({
        id: 'test-id-1',
        manufacturer: 'test',
        model: 'test',
      });
      (mockRepoUsers.update as jest.Mock).mockResolvedValue({
        name: 'test',
        email: 'test',
        euphoniums: ['test-id-1'],
      });

      await controller.post(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should throw error if there is no user id', async () => {
      const req = {
        body: {
          creator: { id: 'test' } as User,
        },
        params: {
          id: 'test',
        },
        info: {},
      } as unknown as RequestPlus;
      (mockRepoUsers.queryId as jest.Mock).mockResolvedValue({});
      (mockRepoEuphoniums.create as jest.Mock).mockResolvedValue({
        model: 'test',
      });
      (mockRepoUsers.update as jest.Mock).mockResolvedValue({ email: 'test' });

      await controller.post(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Given the patch method', () => {
    test('Then it should have been called both update and resp.json', async () => {
      const req = {
        body: {},
        params: {},
      } as unknown as Request;
      await controller.patch(req, resp, next);
      expect(mockRepoEuphoniums.update).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should call next if there are errors', async () => {
      (mockRepoEuphoniums.update as jest.Mock).mockRejectedValue(new Error());
      await controller.patch(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Given the delete method', () => {
    test('Then resp.json should have been called', async () => {
      await controller.delete(req, resp, next);
      expect(mockRepoEuphoniums.remove).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should call next if there are errors', async () => {
      (mockRepoEuphoniums.remove as jest.Mock).mockRejectedValue(new Error());
      await controller.delete(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
