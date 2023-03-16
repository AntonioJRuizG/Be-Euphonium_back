import { Response, Request } from 'express';
import { User } from '../entities/user';
import { Repo } from '../repository/repo.interface';
import { Auth } from '../services/auth';
import { UsersController } from './users.controller';

jest.mock('../services/auth');

describe('Given UsersController', () => {
  const mockRepo: Repo<User> = {
    create: jest.fn(),
    query: jest.fn(),
    search: jest.fn(),
    queryId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const req = {
    body: {},
    params: { id: '' },
  } as unknown as Request;

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();
  const controller = new UsersController(mockRepo);

  describe('Given register method from UsersController', () => {
    test('Then it should be called if there are NOT errors', async () => {
      req.body.email = 'email';
      req.body.pw = 'test';
      await controller.register(req, resp, next);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no email then an error should be catched and call next()', async () => {
      req.body.email = '';
      req.body.pw = 'test';
      await controller.register(req, resp, next);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is no email then an error should be catched and call next()', async () => {
      req.body.email = 'email';
      req.body.pw = '';
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Given the login method from UsersController', () => {
    test('Then should call repo.create with the request body and return the created data as JSON if email and password are correct', async () => {
      req.body.email = 'email';
      req.body.pw = 'test';
      (mockRepo.search as jest.Mock).mockResolvedValue([
        {
          email: 'email',
          pw: 'test',
        },
      ]);

      (Auth.compare as jest.Mock).mockResolvedValue(true);
      await controller.login(req, resp, next);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then should throw an HTTPError with status 401 and message "Unauthorized" if email or password are missing', async () => {
      req.body.email = '';
      req.body.pw = '';
      (mockRepo.search as jest.Mock).mockResolvedValue(['test']);
      (Auth.compare as jest.Mock).mockResolvedValue(false);
      await controller.login(req, resp, next);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('Then should throw a HTTPError if repo.search does not find any data', async () => {
      req.body.email = 'email';
      req.body.pw = 'test';
      (mockRepo.search as jest.Mock).mockResolvedValue({});
      (Auth.compare as jest.Mock).mockResolvedValue(false);
      await controller.login(req, resp, next);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('Then it should throw a HTTPError if the password is wrong', async () => {
      req.body.email = 'email';
      req.body.pw = 'test-pw-wrong';
      (mockRepo.search as jest.Mock).mockResolvedValue(['test-pw']);
      await controller.login(req, resp, next);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('Then if pws do not match (Auth.compare(false)) an error should be catch and should call next()', async () => {
      req.body.email = 'email';
      req.body.pw = 'test';
      (Auth.compare as jest.Mock).mockResolvedValue(false);
      await controller.login(req, resp, next);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
