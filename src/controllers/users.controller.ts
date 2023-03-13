import { Response, Request, NextFunction } from 'express';
import { User } from '../entities/user.js';

import createDebug from 'debug';
import { Repo } from '../repository/repo.interface.js';
import { HTTPError } from '../errors/custom.error.js';
const debug = createDebug('W6:controller:users');

export class UsersController {
  constructor(public repo: Repo<User>) {
    debug('Instantiate');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post');
      if (!req.body.email || !req.body.pw)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');

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
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');

      resp.status(202);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
}
