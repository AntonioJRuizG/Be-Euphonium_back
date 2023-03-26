import { Response, Request, NextFunction } from 'express';
import { User } from '../entities/user.js';
import createDebug from 'debug';
import { RepoUser } from '../repository/repo.interface.js';
import { HTTPError } from '../errors/custom.error.js';
import { Auth, PayloadToken } from '../services/auth.js';
const debug = createDebug('FP:controller:users');

export class UsersController {
  constructor(public repo: RepoUser<User>) {
    debug('Instantiate');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      /* Temp: Manage "already registered" error:
       const data2 = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (data2.length)
        throw new HTTPError(409, 'Email already exists', 'User already in db'); */
      req.body.password = await Auth.hash(req.body.password);
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
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });

      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.password, data[0].password)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'admin',
      };
      const token = Auth.createJWT(payload);
      const userData = await this.repo.queryId(data[0].id);

      resp.status(202);
      resp.json({
        token,
        user: userData,
      });
    } catch (error) {
      next(error);
    }
  }
}
