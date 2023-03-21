import { Router } from 'express';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';
import { UsersController } from '../controllers/users.controller.js';
import createDebug from 'debug';

const debug = createDebug('W6:router:users');
// eslint-disable-next-line new-cap
export const usersRouter = Router();
debug('loaded');
const repo = UsersMongoRepo.getInstance();
const controller = new UsersController(repo);

usersRouter.get('/', controller.get.bind(controller));
usersRouter.get('/:id', controller.get.bind(controller));
usersRouter.post('/registro', controller.register.bind(controller));
usersRouter.post('/acceso', controller.login.bind(controller));
