import { Router } from 'express';
import { BombardinosController } from '../controllers/bombardinos.controller.js';
import { authorized } from '../interceptors/authorized.js';
import { logged } from '../interceptors/logged.js';
import { BombardinosMongoRepo } from '../repository/bombardino.mongo.repo.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';

// eslint-disable-next-line new-cap
export const bombardinosRouter = Router();
const bombardinosRepo = BombardinosMongoRepo.getInstance();
const usersRepo = UsersMongoRepo.getInstance();
const controller = new BombardinosController(usersRepo, bombardinosRepo);

bombardinosRouter.get('/', controller.getPaginated.bind(controller));

// Tmp bombardinosRouter.get('/', controller.getAll.bind(controller));

bombardinosRouter.get('/:id', controller.get.bind(controller));
bombardinosRouter.post('/', logged, controller.post.bind(controller));
bombardinosRouter.patch(
  '/:id',
  logged,
  (req, resp, next) => authorized(req, resp, next, bombardinosRepo),
  controller.patch.bind(controller)
);
bombardinosRouter.delete(
  '/:id',
  logged,
  (req, resp, next) => authorized(req, resp, next, bombardinosRepo),
  controller.delete.bind(controller)
);
