import { Router } from 'express';
import { BombardinosController } from '../controllers/bombardinos.controller.js';
import { logged } from '../interceptors/logged.js';
import { BombardinosMongoRepo } from '../repository/bombardino.mongo.repo.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';

// eslint-disable-next-line new-cap
export const bombardinosRouter = Router();
const bombardinosRepo = BombardinosMongoRepo.getInstance();
const usersRepo = UsersMongoRepo.getInstance();
const controller = new BombardinosController(usersRepo, bombardinosRepo);

bombardinosRouter.get('/', controller.getAll.bind(controller));
bombardinosRouter.get('/:id', controller.get.bind(controller));
bombardinosRouter.post('/', logged, controller.post.bind(controller));
bombardinosRouter.patch('/:id', logged, controller.patch.bind(controller));
bombardinosRouter.delete('/:id', logged, controller.delete.bind(controller));
