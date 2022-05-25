import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/http.exception';

export const errorMiddleware = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    console.log('[#ERR#] [ API ] Error on Request');
    console.log('[#   #] [ API ]     ' + req.url);
    console.log('[#   #] [ API ] Response');
    console.log('[#   #] [ API ]     ' + err.statusCode, err.message);

    res.status(err.statusCode).send(err.statusCode + " " + err.message);
}