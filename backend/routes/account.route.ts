import {NextFunction, Request, Response, Router} from "express";
import {HttpException} from "../exceptions/http.exception";
import {plainToInstance} from "class-transformer";
import {Account} from "../models/account";
import {User} from "../models/user";

export const accountRouter: Router = Router();

accountRouter.post('', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.token || !req.body.account.name || !req.body.account.number || !req.body.account.balance || !req.body.account.provider || !req.body.account.type) {
        next(new HttpException('Bad request', 400));
        return;
    }

    let user: User = await req.services.authService.authToken(req.body.token).catch(error => {next(error)});
    if (!user) return;

    let account: Account = plainToInstance(Account, req.body.account);

    if (!await req.services.accountService.insertAccount(user._id, account).catch(error => {next(error)})) return;
    res.status(200).send();
});

accountRouter.put('', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.token || !req.body.previousNumber || !req.body.account.name || !req.body.account.number || !req.body.account.balance || !req.body.account.provider || !req.body.account.type) {
        next(new HttpException('Bad request', 400));
        return;
    }

    let user: User = await req.services.authService.authToken(req.body.token).catch(error => {next(error)});
    if (!user) return;

    let account: Account = plainToInstance(Account, req.body.data);

    if (!await req.services.accountService.updateAccount(req.body.previousNumber, account).catch(error => {next(error)})) return;
    res.status(200).send();
});

accountRouter.delete('', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.token || !req.body.account.number) {
        next(new HttpException('Bad request', 400));
        return;
    }

    let user: User = await req.services.authService.authToken(req.body.token).catch(error => {next(error)});
    if (!user) return;

    let account: Account = plainToInstance(Account, req.body.account);

    if (!await req.services.accountService.removeAccount(account).catch(error => {next(error)})) return;
    res.status(200).send();
});
