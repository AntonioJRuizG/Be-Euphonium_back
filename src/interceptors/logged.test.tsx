import { Response } from 'express';
import { Auth } from '../services/auth';
import { logged, RequestPlus } from './logged';

jest.mock('../services/auth');

const next = jest.fn();
const mockReq = {
  get: jest.fn(),
  info: {},
} as unknown as RequestPlus;

const mockRes = {} as Response;

describe('Given logged function', () => {
  describe('When it is called with a Authorisation Bearer token', () => {
    test('Then it should call next()', async () => {
      (mockReq.get as jest.Mock).mockReturnValue('Bearer Authorisation-test');
      (Auth.verifyJWTGettingPayload as jest.Mock).mockResolvedValue(
        'token-test'
      );
      await logged(mockReq, mockRes, next);
      expect(next).toBeCalled();
    });
  });

  describe('When there is no Authorisation', () => {
    test('Then it should throw HTTPError', async () => {
      (mockReq.get as jest.Mock).mockReturnValue(undefined);
      await logged(mockReq, mockRes, next);
      expect(next).toBeCalled();
    });
  });

  describe('When there is an Authorisation but it is not Bearer Token', () => {
    test('Then it should throw HTTPError', async () => {
      (mockReq.get as jest.Mock).mockReturnValue('Other authorisation test');
      await logged(mockReq, mockRes, next);
      expect(next).toBeCalled();
    });
  });
});
