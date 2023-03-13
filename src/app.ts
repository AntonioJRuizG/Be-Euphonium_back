import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import express from 'express';
import { usersRouter } from './routers/users.router.js';
import { errorsMiddleware } from './middlewares/errors.middleware.js';
const debug = createDebug('W6:app');

export const app = express();

app.disable('x-powered-by');
const corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

debug('running');

app.use(express.static('public'));

app.use('/users', usersRouter);

app.get('/', (_req, resp) => {
  resp.json({
    info: 'Euphoniums',
    endpoints: { users: '/users', euphoniums: '/euphoniums' },
  });
});

app.use(errorsMiddleware);
