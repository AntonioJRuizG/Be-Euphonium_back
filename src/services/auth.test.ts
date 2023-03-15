import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Auth, PayloadToken } from './auth';

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

const mockPayloadToken = {
  id: 'test',
  email: 'test',
  role: 'test',
} as PayloadToken;

describe('Given Auth', () => {
  describe('When createJWT static method is called', () => {
    test('Then the sign function should sign a given payload into a JSON Web Token string payload', () => {
      Auth.createJWT(mockPayloadToken);
      expect(jwt.sign).toHaveBeenCalled();
    });
  });

  describe('When verifyJWTGettingPayload static method is called', () => {
    test('Then the verify function should be called', () => {
      (jwt.verify as jest.Mock).mockReturnValue(mockPayloadToken);
      Auth.verifyJWTGettingPayload('test-token');
      expect(jwt.verify).toHaveBeenCalled();
    });

    test('Then should throw a HTTPError "InvalidP Payload" if jwt.verify returns a string', () => {
      (jwt.verify as jest.Mock).mockReturnValue('string');
      expect(() => Auth.verifyJWTGettingPayload('test')).toThrowError();
    });
  });

  describe('When hash method is called', () => {
    test('Then it should call the bcrypt.hash function that generates a hash for the given mock-string', () => {
      Auth.hash('mock-string');
      expect(bcrypt.hash).toHaveBeenCalled();
    });
  });

  describe('When compare method is called', () => {
    test('Then it should call the bcrypt.compare function that compar the mock-string agains the test-hash', () => {
      Auth.compare('test-string', 'test-hash');
      expect(bcrypt.compare).toHaveBeenCalled();
    });
  });
});
