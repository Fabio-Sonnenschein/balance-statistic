import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express';
import {HttpException} from '../exceptions/http.exception';
import {plainToInstance} from 'class-transformer';
import {Account} from '../models/account';
import {User} from '../models/user';
import {ObjectId} from 'mongodb';

export const accountRouter: Router = Router();

accountRouter.get('/:accountId/:userToken', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.accountId ||
    !req.params.userToken) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.params.userToken, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  if (req.params.accountId === 'a') {
    let accounts = await req.services.accountService.getAccountsByUser(user._id)
      .catch((error: Error) => {
        return next(error);
      });
    res.status(200).json(accounts);
  }

  let accountId: ObjectId = plainToInstance(ObjectId, req.params.accountId);
  let account = await req.services.accountService.getAccount(new ObjectId(accountId), user._id)
    .catch((error: Error) => {
      return next(error);
    });
  res.status(200).json(account);
});

accountRouter.post('', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.account.name ||
    !req.body.account.number ||
    !req.body.account.balance ||
    !req.body.account.provider ||
    !req.body.account.type) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let account: Account = plainToInstance(Account, req.body.account);
  account.access.owner = user._id;
  account.access.subscribers.push(user._id);
  if (req.body.subscribers) {
    account.access.subscribers.push(req.body.subscribers);
  }

  let insert = await req.services.accountService.insertAccount(user._id, account)
    .catch((error: Error) => {
      return next(error);
    });
  if (!insert) return next(new HttpException('Account insertion failed', 500));
  res.status(200).json(true);
});

accountRouter.put('/number', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.account._id ||
    !req.body.account.number) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.accountService.updateAccountNumber(user._id, req.body.account._id, req.body.account.number)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Account update failed', 500));
  res.status(200).json(true);
});

accountRouter.put('/name', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.account._id ||
    !req.body.account.name) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.accountService.updateAccountName(user._id, req.body.account._id, req.body.account.name)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Account update failed', 500));
  res.status(200).json(true);
});

accountRouter.put('/balance', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.account._id ||
    !req.body.account.balance) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.accountService.updateAccountBalance(user._id, req.body.account._id, req.body.account.balance)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Account update failed', 500));
  res.status(200).json(true);
});

accountRouter.put('/provider', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.account._id ||
    !req.body.account.provider) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.accountService.updateAccountProvider(user._id, req.body.account._id, req.body.account.provider)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Account update failed', 500));
  res.status(200).json(true);
});

accountRouter.put('/type', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.account._id ||
    !req.body.account.type) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.accountService.updateAccountType(user._id, req.body.account._id, req.body.account.type)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Account update failed', 500));
  res.status(200).json(true);
});

accountRouter.put('/currency', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.account._id ||
    !req.body.account.currency) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.accountService.updateAccountCurrency(user._id, req.body.account._id, req.body.account.currency)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Account update failed', 500));
  res.status(200).json(true);
});

accountRouter.put('/subscriber/add', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.account._id ||
    !req.body.account.subscriber) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.accountService.updateAccountSubscriberAdd(user._id, req.body.account._id, req.body.account.subscriber)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Account update failed', 500));
  res.status(200).json(true);
});

accountRouter.put('/subscriber/remove', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.account._id ||
    !req.body.account.subscriber) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.accountService.updateAccountSubscriberRemove(user._id, req.body.account._id, req.body.account.subscriber)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Account update failed', 500));
  res.status(200).json(true);
});

accountRouter.put('/owner', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.account._id ||
    !req.body.account.owner) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let result = await req.services.accountService.updateAccountOwner(user._id, req.body.account._id, req.body.account.owner)
    .catch((error: Error) => {
      return next(error);
    });
  if (!result) return next(new HttpException('Account update failed', 500));
  res.status(200).json(true);
});

accountRouter.delete('', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.account._id) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let deleteQuery = await req.services.accountService.removeAccount(user._id, req.body.account._id)
    .catch((error: Error) => {
      return next(error);
    });
  if (!deleteQuery) return next(new HttpException('Account removal failed', 500));
  res.status(200).json(true);
});
