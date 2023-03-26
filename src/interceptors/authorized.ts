import { NextFunction, Response } from 'express';
import { RequestPlus } from './logged.js';
import createDebug from 'debug';
import { HTTPError } from '../errors/custom.error.js';
import { EuphoniumsMongoRepo } from '../repository/euphonium.mongo.repo.js';

const debug = createDebug('BC:interceptor:authorized');
export async function authorized(
  req: RequestPlus,
  _resp: Response,
  next: NextFunction,
  repoEuphonium: EuphoniumsMongoRepo
) {
  try {
    debug('Called');
    if (!req.info)
      throw new HTTPError(
        498,
        'Token not found',
        'Token not found in Authorized interceptor'
      );
    const userId = req.info.id;
    const euphoniumId = req.params.id;
    const euphonium = await repoEuphonium.queryId(euphoniumId);
    if (euphonium.creator.id !== userId)
      throw new HTTPError(401, 'Not your euphonium', 'Not authorized');
    next();
  } catch (error) {
    next(error);
  }
}
