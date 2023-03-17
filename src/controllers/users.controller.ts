import { Response, Request, NextFunction } from 'express';
import { User } from '../entities/user.js';
import createDebug from 'debug';
import { RepoSmall } from '../repository/repo.interface.js';
import { HTTPError } from '../errors/custom.error.js';
import { Auth, PayloadToken } from '../services/auth.js';
const debug = createDebug('W6:controller:users');

export class UsersController {
  constructor(public repo: RepoSmall<User>) {
    debug('Instantiate');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post', req.body.email, req.body);
      if (!req.body.email || !req.body.pw)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      /* Add this code to manage user already exists error: const data2 = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (data2.length)
        throw new HTTPError(409, 'Email already exists', 'User already in db'); */
      req.body.pw = await Auth.hash(req.body.pw);
      const data = await this.repo.create(req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      debug('Unable to register');
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login:post');
      if (!req.body.email || !req.body.pw)
        throw new HTTPError(401, 'Unauthorized', 'Invalid email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.pw, data[0].pw)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'admin',
      };
      const token = Auth.createJWT(payload);
      resp.status(202);
      resp.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}
