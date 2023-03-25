import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';
import { User } from '../entities/user.js';
import { Bombardino } from '../entities/bombardino.js';
import { RepoPlus, RepoSmall } from '../repository/repo.interface.js';
import { RequestPlus } from '../interceptors/logged.js';
import { HTTPError } from '../errors/custom.error.js';

const debug = createDebug('W6:controller:bombardinos');

export class BombardinosController {
  constructor(
    public usersRepo: RepoSmall<User>,
    public bombardinosRepo: RepoPlus<Bombardino>
  ) {
    debug('Instantiate');
  }

  async get(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('get');
      const data = await this.bombardinosRepo.queryId(req.params.id);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll');
      const data = await this.bombardinosRepo.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaginated(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getPaginated');
      const data = await this.bombardinosRepo.queryPaginated(
        req.query.offset as string
      );
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async post(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('post');
      const userId = req.info?.id;
      if (!userId) throw new HTTPError(404, 'Not found', 'Not found user id');
      const actualUser = await this.usersRepo.queryId(userId);
      req.body.creator = userId;
      const newEuphonium = await this.bombardinosRepo.create(req.body);
      actualUser.bombardinos.push(newEuphonium);
      this.usersRepo.update(actualUser);
      resp.json({
        results: [newEuphonium],
      });
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('patch');
      req.body.id = req.params.id ? req.params.id : req.body.id;
      const data = await this.bombardinosRepo.update(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('delete');
      await this.bombardinosRepo.remove(req.params.id);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
