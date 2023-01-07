import {
  Request,
  Response,
  NextFunction
} from 'express';
import {HttpException} from '../exceptions/http.exception';

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || 'Internal server error';

  console.log('[#ERR#] [ API ] Error on Request');
  console.log('[#   #] [ API ]     ' + req.url);
  console.log('[#   #] [ API ] Response');
  console.log('[#   #] [ API ]     ' + error.statusCode, error.message);
  console.log('[#   #] [ API ]');
  console.log('[#####] [ API ] Error report concluded.');
  console.log('[     ] [     ]');

  res.status(error.statusCode).send(error.statusCode + ' ' + error.message);
};
