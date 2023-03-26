import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';
import { User } from '../entities/user.js';
import { Euphonium } from '../entities/euphonium.js';
import { RepoEuph, RepoUser } from '../repository/repo.interface.js';
import { RequestPlus } from '../interceptors/logged.js';
import { HTTPError } from '../errors/custom.error.js';

const debug = createDebug('FP:controller:euphoniums');

export class EuphoniumsController {
  constructor(
    public usersRepo: RepoUser<User>,
    public euphoniumsRepo: RepoEuph<Euphonium>
  ) {
    debug('Instantiate');
  }

  async get(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('get');
      const data = await this.euphoniumsRepo.queryId(req.params.id);
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
      const data = await this.euphoniumsRepo.query();
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
      const data = await this.euphoniumsRepo.queryPaginated(
        req.query.offset as string
      );
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFiltered(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getFiltered');
      const data = await this.euphoniumsRepo.queryFiltered(
        req.query.offset as string,
        req.query.level as string
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
      const newEuphonium = await this.euphoniumsRepo.create(req.body);
      actualUser.euphoniums.push(newEuphonium);
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
      const data = await this.euphoniumsRepo.update(req.body);
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
      await this.euphoniumsRepo.remove(req.params.id);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
