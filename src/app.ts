import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import express from 'express';
import { usersRouter } from './routers/users.router.js';
import { errorsMiddleware } from './middlewares/errors.middleware.js';
import { bombardinosRouter } from './routers/bombardinos.router.js';
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

app.use('/usuarios', usersRouter);
app.use('/bombardinos', bombardinosRouter);

app.get('/', (_req, resp) => {
  resp.json({
    info: 'La comunidad del Bombardino',
    bombardinos: '/bombardinos',
  });
});

app.use(errorsMiddleware);
