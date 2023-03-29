import { Request, Response } from 'express';
import { errorsMiddleware } from './errors.middleware';
import { Error as MongooseError } from 'mongoose';
import { HTTPError } from '../error/custom.error';

const req = {} as Request;

const resp = {
  json: jest.fn(),
  status: jest.fn(),
} as unknown as Response;

const next = jest.fn();

describe('Given the errorsMiddleware', () => {
  describe('When there is a mongoose cast error', () => {
    test('Then it should give a status 400', () => {
      const error = new MongooseError.CastError('', '', '');
      errorsMiddleware(error, req, resp, next);
      expect(resp.status).toHaveBeenCalledWith(400);
    });
  });

  describe('When there is a mongoose validation error', () => {
    test('Then if should give a 406 status', () => {
      const error = new MongooseError.ValidationError();
      errorsMiddleware(error, req, resp, next);
      expect(resp.status).toHaveBeenCalledWith(406);
    });
  });

  describe('When there is custom HTTPError', () => {
    test('Then status should be HTTPError', () => {
      const error = new HTTPError(418, 'Tee', 'Pot');
      errorsMiddleware(error, req, resp, next);
      expect(resp.status).toHaveBeenCalledWith(418);
    });
  });

  describe('When there is other type of error', () => {
    test('Then the error status should be 500', () => {
      const error = new Error('Tee Pot');
      errorsMiddleware(error, req, resp, next);
      expect(resp.status).toHaveBeenCalledWith(500);
    });
  });
});
