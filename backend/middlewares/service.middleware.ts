import { Request, Response, NextFunction } from 'express';
import services from '../services';

export const serviceMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.services = services;
    next();
};