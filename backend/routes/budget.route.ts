import {NextFunction, Request, Response, Router} from "express";
import {HttpException} from "../exceptions/http.exception";
import {User} from "../models/user";
import {Budget} from "../models/budget";

export const budgetRouter: Router = Router();

budgetRouter.get('/:userToken', async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.userToken === "" || !req.params.userToken) {
        next(new HttpException('Bad request', 400));
        return;
    }

    let user: User = await req.services.authService.authToken(req.params.userToken, req, next).catch((error: Error) => {return next(error)});
    if (!user) return;

    res.json(req.services.userService.projectUser(
        user,
        false,
        false,
        false,
        false,
        true,
        false
        ));
});

budgetRouter.put('/savingRate', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.token || !req.body.budget.savingRate) {
        return next(new HttpException('Bad request', 400));
    }

    let user: User = await req.services.authService.authToken(req.body.token, req, next).catch((error: Error) => {return next(error)});
    if (!user) return;

    if (!await req.services.budgetService.updateBudgetSavingRate(user._id, req.body.budget.savingRate, next).catch((error: Error) => {return next(error)})) return next(new HttpException('Budget update failed', 500));
    res.status(200).json(true);
});

budgetRouter.put('/budget', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.token || !req.body.budget.budget) {
        return next(new HttpException('Bad request', 400));
    }

    let user: User = await req.services.authService.authToken(req.body.token, req, next).catch((error: Error) => {return next(error)});
    if (!user) return;

    if (!await req.services.budgetService.updateBudgetBudget(user._id, req.body.budget.budget, next).catch((error: Error) => {return next(error)})) return next(new HttpException('Budget update failed', 500));
    res.status(200).json(true);
});

budgetRouter.put('/earnings', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.token || !req.body.budget.earnings) {
        return next(new HttpException('Bad request', 400));
    }

    let user: User = await req.services.userService.authToken(req.body.token, req, next).catch((error: Error) => {return next(error)});
    if (!user) return;

    if (!await req.services.budgetService.updateBudgetEarnings(user._id, req.body.budget.earnings, next).catch((error: Error) => {return next(error)})) return next(new HttpException('Budget update failed', 500));
    res.status(200).json(true);
});

budgetRouter.put('/expenses', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.token || !req.body.budget.expenses) {
        return next(new HttpException('Bad request', 400));
    }

    let user: User = await req.services.userService.authToken(req.body.token, req, next).catch((error: Error) => {return next(error)});
    if (!user) return;

    if (!await req.services.budgetService.updateBudgetExpenses(user._id, req.body.buget.expenses, next).catch((error: Error) => {return next(error)})) return next(new HttpException('Budget update failed', 500));
    res.status(200).json(true);
});

budgetRouter.post('', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.token || !req.body.budget.budget || !req.body.budget.savingRate) {
        return next(new HttpException('Bad request', 400));
    }

    let user: User = await req.services.authService.authToken(req.body.token, req, next).catch((error: Error) => {return next(error)});
    if (!user) return;

    if (!await req.services.budgetService.insertBudget(user._id, req.body.budget, next).catch((error: Error) => {return next(error)})) return next(new HttpException('Budget update failed', 500));
    res.status(200).json(true);
});

budgetRouter.delete('', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.token || !req.body.account.number) {
        next(new HttpException('Bad request', 400));
        return;
    }

    let user: User = await req.services.authService.authToken(req.body.token, req, next).catch((error: Error) => {return next(error)});
    if (!user) return;

    let emptyBudget: Budget = new Budget();
    emptyBudget.savingRate = 0;
    emptyBudget.budget = 0;
    emptyBudget.earnings = 0;
    emptyBudget.expenses = 0;
    if (!await req.services.budgetService.insertBudget(user._id, emptyBudget, next).catch((error: Error) => {return next(error)})) return;
    res.status(200).send();
});
