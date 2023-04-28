import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import createDebug from 'debug';
import { CustomError, HTTPError } from '../errors/custom.error.js';

const debug = createDebug('FP:app:errors');

export const errorsMiddleware = (
  error: CustomError | Error,
  _req: Request,
  resp: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  debug('Errors middleware');
  let status = 500;
  let statusMessage = 'Internal server error';

  if (error instanceof HTTPError) {
    status = error.statusCode;
    statusMessage = error.statusMessage;
  }

  if (error instanceof Error.CastError) {
    status = 400;
    statusMessage = 'Bad data formate in request';
  }

  if (error instanceof Error.ValidationError) {
    status = 406;
    statusMessage = 'Validation error in the request';
  }

  resp.status(status);
  resp.json({
    error: [
      {
        status,
        statusMessage,
      },
    ],
  });
  debug(status, statusMessage, error.message);
};
