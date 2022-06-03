import {NextFunction, Request, Response, Router} from "express";
import {HttpException} from "../exceptions/http.exception";
import {User} from "../models/user";

export const budgetRouter: Router = Router();

budgetRouter.put('', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.token || !req.body.budget.budget || !req.body.budget.savingRate) {
        next(new HttpException('Bad request', 400));
        return;
    }

    let user: User = await req.services.authService.authToken(req.body.token).catch(error => {next(error)});
    if (!user) return;

    if (!await req.services.budgetService.updateBudget(user._id, req.body.budget).catch(error => {next(error)})) return;
    res.status(200).send();
});