import {NextFunction, Request, Response, Router} from "express";
import {HttpException} from "../exceptions/http.exception";

export const loginRouter: Router = Router();

loginRouter.post('', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.email || !req.body.password) {
        next(new HttpException('Bad request', 400));
        return;
    }

    let user = await req.services.authService.authUser(req.body.email, req.body.password).catch(error => next(error));
    if (!user) return;

    let accessToken = req.services.authService.generateToken();
    let expires = new Date(Date.now() + Number(process.env.TOKEN_EXPIRATION));

    if (!await req.services.userService.setToken(user.email, accessToken, expires).catch(error => next(error))) return;
    res.status(200).json({'token': accessToken, 'expires': expires.toISOString(), 'name': user.name});
});