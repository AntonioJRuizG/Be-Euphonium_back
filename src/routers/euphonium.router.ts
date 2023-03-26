import { Router } from 'express';
import { EuphoniumsController } from '../controllers/euphoniums.controller.js';
import { authorized } from '../interceptors/authorized.js';
import { logged } from '../interceptors/logged.js';
import { EuphoniumsMongoRepo } from '../repository/euphonium.mongo.repo.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';

// eslint-disable-next-line new-cap
export const euphoniumsRouter = Router();
const euphoniumsRepo = EuphoniumsMongoRepo.getInstance();
const usersRepo = UsersMongoRepo.getInstance();
const controller = new EuphoniumsController(usersRepo, euphoniumsRepo);

euphoniumsRouter.get('/', controller.getPaginated.bind(controller));
euphoniumsRouter.get('/filter', controller.getFiltered.bind(controller));

// Tmp euphoniumsRouter.get('/', controller.getAll.bind(controller));

euphoniumsRouter.get('/:id', controller.get.bind(controller));
euphoniumsRouter.post('/', logged, controller.post.bind(controller));
euphoniumsRouter.patch(
  '/:id',
  logged,
  (req, resp, next) => authorized(req, resp, next, euphoniumsRepo),
  controller.patch.bind(controller)
);
euphoniumsRouter.delete(
  '/:id',
  logged,
  (req, resp, next) => authorized(req, resp, next, euphoniumsRepo),
  controller.delete.bind(controller)
);
