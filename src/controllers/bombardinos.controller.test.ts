import { Request, Response } from 'express';
import { Bombardino } from '../entities/bombardino';
import { User } from '../entities/user';
import { RepoPlus, RepoSmall } from '../repository/repo.interface';
import { BombardinosController } from './bombardinos.controller';

describe('Given ThingsController', () => {
  const mockRepoUsers: RepoSmall<User> = {
    create: jest.fn(),
    query: jest.fn(),
    search: jest.fn(),
    queryId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRepoBombardinos: RepoPlus<Bombardino> = {
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
  } as unknown as Request;

  const resp = {
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();

  const controller = new BombardinosController(
    mockRepoUsers,
    mockRepoBombardinos
  );

  describe('Given getAll method', () => {
    test('Then it should be called if there are NOT errors', async () => {
      await controller.getAll(req, resp, next);
      expect(mockRepoBombardinos.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should have been called if there are errors', async () => {
      (mockRepoBombardinos.query as jest.Mock).mockRejectedValue(new Error());
      await controller.getAll(req, resp, next);
      expect(mockRepoBombardinos.query).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Given get method', () => {
    test('Then it should have been called if there are NOT errors', async () => {
      await controller.get(req, resp, next);
      expect(mockRepoBombardinos.queryId).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should call next if there are errors', async () => {
      (mockRepoBombardinos.queryId as jest.Mock).mockRejectedValue(new Error());

      await controller.get(req, resp, next);
      expect(mockRepoBombardinos.queryId).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Given post method', () => {
    test('Then it should have been called if there are NOT errors', async () => {
      (mockRepoUsers.queryId as jest.Mock).mockResolvedValue({
        email: 'test',
        euphoniums: [''],
      });
      (mockRepoBombardinos.create as jest.Mock).mockResolvedValue({
        model: 'test',
      });
      (mockRepoUsers.update as jest.Mock).mockResolvedValue({ email: 'test' });

      await controller.post(req, resp, next);

      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should return an error if post does not work', async () => {
      (mockRepoBombardinos.create as jest.Mock).mockRejectedValue(
        new Error('')
      );
      await controller.post(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Given patch method', () => {
    test('Then it should have been called if there are NOT errors', async () => {
      const req = {
        body: {},
        params: {},
      } as unknown as Request;
      await controller.patch(req, resp, next);
      expect(mockRepoBombardinos.update).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should call next if there are errors', async () => {
      (mockRepoBombardinos.update as jest.Mock).mockRejectedValue(new Error());
      await controller.patch(req, resp, next);
      expect(mockRepoBombardinos.update).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Given delete method', () => {
    test('Then it should have been called if there are NOT errors', async () => {
      await controller.delete(req, resp, next);
      expect(mockRepoBombardinos.remove).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should call next if there are errors', async () => {
      (mockRepoBombardinos.remove as jest.Mock).mockRejectedValue(new Error());
      await controller.delete(req, resp, next);
      expect(mockRepoBombardinos.remove).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
