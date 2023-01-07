import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express';
import {HttpException} from '../exceptions/http.exception';
import {User} from '../models/user';
import {plainToInstance} from 'class-transformer';
import {SavingGoal} from '../models/savingGoal';
import {ObjectId} from 'mongodb';

export const savingGoalRouter: Router = Router();

savingGoalRouter.get('/:userToken', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.userToken) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.params.userToken, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let savingGoals = await req.services.savingGoalService.getSavingGoals(user._id)
    .catch((error: Error) => {
      return next(error);
    });
  if (!savingGoals) return next(new HttpException('Saving goal retrieval failed', 500));
  res.status(200).json(savingGoals);
});

savingGoalRouter.get('/:userToken/:savingGoalId', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.userToken ||
    !req.params.savingGoalId) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.params.userToken, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let savingGoal = await req.services.savingGoalService.getSavingGoalById(new ObjectId(req.params.savingGoalId))
    .catch((error: Error) => {
      throw next(error);
    });
  if (!req.services.savingGoalService.checkSavingGoalAffiliation(savingGoal, user._id)) {
    return next(new HttpException('Saving goal request is unauthorized', 401));
  }
  res.status(200).json(savingGoal);
});

savingGoalRouter.post('', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.savingGoal.name ||
    !req.body.savingGoal.total ||
    !req.body.savingGoal.current ||
    !req.body.savingGoal.startDate ||
    !req.body.savingGoal.access.owner ||
    !req.body.savingGoal.account) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let savingGoal: SavingGoal = plainToInstance(SavingGoal, req.body.savingGoal);

  let savingGoalId = await req.services.savingGoalService.insertSavingGoal(savingGoal)
    .catch((error: Error) => {
      return next(error);
    });
  if (!savingGoalId) return next(new HttpException('Saving goal insertion failed', 500));
  res.json(savingGoalId);
});

savingGoalRouter.put('/name', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.savingGoal._id ||
    !req.body.savingGoal.name) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.savingGoalService.updateSavingGoalName(user._id, req.body.savingGoal._id, req.body.savingGoal.name)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Saving goal update failed', 500));
  res.status(200).json(true);
});

savingGoalRouter.put('/description', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.savingGoal._id ||
    !req.body.savingGoal.description) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 4001));

  let update = await req.services.savingGoalService.updateSavingGoalDescription(user._id, req.body.savingGoal._id, req.body.savingGoal.description)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Saving goal update failed', 500));
  res.status(200).json(true);
});

savingGoalRouter.put('/total', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.savingGoal._id ||
    !req.body.savingGoal.total) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.savingGoalService.updateSavingGoalTotal(user._id, req.body.savingGoal._id, req.body.savingGoal.total)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Saving goal update failed', 500));
  res.status(200).json(true);
});

savingGoalRouter.put('/current', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.savingGoal._id ||
    !req.body.savingGoal.current) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.savingGoalService.updateSavingGoalCurrent(user._id, req.body.savingGoal._id, req.body.savingGoal.current)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Saving goal update failed', 500));
  res.status(200).json(true);
});

savingGoalRouter.put('/startDate', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.savingGoal._id ||
    !req.body.savingGoal.startDate) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.savingGoalService.updateSavingGoalStartDate(user._id, req.body.savingGoal._id, req.body.savingGoal.startDate)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Saving goal update failed', 500));
  res.status(200).json(true);
});

savingGoalRouter.put('/endDate', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.savingGoal._id ||
    !req.body.savingGoal.endDate) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return;

  let update = await req.services.savingGoalService.updateSavingGoalEndDate(user._id, req.body.savingGoal._id, req.body.savingGoal.endDate)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Saving goal update failed', 500));
  res.status(200).json(true);
});

savingGoalRouter.put('/category', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.savingGoal._id ||
    !req.body.savingGoal.category) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.savingGoalService.updateSavingGoalCategory(user._id, req.body.savingGoal._id, req.body.savingGoal.category)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Saving goal update failed', 500));
  res.status(200).json(true);
});

savingGoalRouter.put('/account', async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Transfer current amount from previous to new account
  res.status(501).send();
});

savingGoalRouter.put('/contributor/rate', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.savingGoal._id ||
    !req.body.savingGoal.contributors._id ||
    !req.body.savingGoal.contributors.rate) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.savingGoalService.updateSavingGoalContributorRate(user._id, req.body.savingGoal._id, req.body.savingGoal.contributors._id, req.body.savingGoal.contributors.rate)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Saving goal update failed', 500));
  res.status(200).json(true);
});

savingGoalRouter.put('/contributor/add', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.savingGoal._id ||
    !req.body.savingGoal.contributors._id ||
    !req.body.savingGoal.contributors.rate) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 500));

  let update = await req.services.savingGoalService.updateSavingGoalContributorAdd(user._id, req.body.savingGoal._id, req.body.savingGoal.contributors._id, req.body.savingGoal.contributors.rate)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Saving goal update failed', 500));
  res.status(200).json(true);
});

savingGoalRouter.put('/contributor/remove', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.savingGoal._id ||
    !req.body.savingGoal.contributors._id) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 500));

  let update = await req.services.savingGoalService.updateSavingGoalContributorRemove(user._id, req.body.savingGoal._id, req.body.savingGoal.contributors._id)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Saving goal update failed', 500));
  res.status(200).json(true);
});

savingGoalRouter.put('/owner', async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Linked account needs to change as well
  res.status(501).send();
});

savingGoalRouter.delete('', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.savingGoal._id) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let deleteQuery = await req.services.savingGoalService.removeSavingGoal(user._id, req.body.savingGoal._id)
    .catch((error: Error) => {
      return next(error);
    });
  if (!deleteQuery) return next(new HttpException('Saving goal removal failed', 500));
  res.status(200).json(true);
});
