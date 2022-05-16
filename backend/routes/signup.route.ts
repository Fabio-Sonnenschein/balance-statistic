import {NextFunction, Request, Response, Router} from "express";
import {plainToInstance} from "class-transformer";
import {User} from "../models/user";
import {HttpException} from "../exceptions/http.exception";

export const signupRouter: Router = Router();

signupRouter.post('', async (req: Request, res: Response, next: NextFunction) => {
    let user = plainToInstance(User, req.body);
    if (!req.services.userService.validateUser(user)) {
        throw new HttpException('User invalid', 400);
    }

    let result = await req.services.userService.insertUser(user).catch((error: Error) => next(error));
    if (!result) throw new HttpException('Email already registered', 409);
    if (result.acknowledged === true) {
        let accessToken = req.services.authService.generateToken();
        let expires = new Date(Date.now() + Number(process.env.TOKEN_EXPIRATION_TIME));

        if (!await req.services.userService.setToken(user.email, accessToken, expires).catch(error => next(error))) return;
        res.status(200).json({'token': accessToken, 'expires': expires.toISOString(), 'name': user.name});
    } else {
        next(new HttpException('Server error', 500));
    }
});