import {NextFunction, Request, Response, Router} from "express";
import {plainToInstance} from "class-transformer";
import {User} from "../models/user";
import {HttpException} from "../exceptions/http.exception";

export const registerRouter: Router = Router();

registerRouter.post('', async (req: Request, res: Response, next: NextFunction) => {
    let user = plainToInstance(User, req.body);
    if (!req.services.userService.validateUser(user)) {
        throw new HttpException('User invalid', 400);
    }

    let result = await req.services.userService.insertUser(user).catch((error: Error) => next(error));
    if (!result) throw new HttpException('User registration failed', 500);
    if (result.acknowledged === true) {
        res.status(201).json('OK');
    } else {
        next(new HttpException('Server error', 500));
    }
});