import {
  Request,
  Response,
  NextFunction,
  Router
} from 'express';
import {HttpException} from '../exceptions/http.exception';
import {User} from '../models/user';

export const userRouter: Router = Router();

userRouter.put('/name', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.id ||
    !req.body.name) {
    return next(new HttpException('Bad request', 400));
  }

  let result = await req.services.userService.updateUserName(req.body.id, req.body.name, next)
    .catch((error: Error) => {
      return next(error);
    });
  if (!result) {
    return next(new HttpException('User update failed.', 500));
  } else {
    res.status(200).json(true);
  }
});

userRouter.put('/email', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.id ||
    !req.body.email) {
    return next(new HttpException('Bad request', 400));
  }

  let result = await req.services.userService.updateUserEmail(req.body.id, req.body.email, next)
    .catch((error: Error) => {
      return next(error);
    });
  if (!result) {
    return next(new HttpException('User update failed', 500));
  } else {
    res.status(200).json(true);
  }
});

userRouter.put('/password', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.id ||
    !req.body.password) {
    return next(new HttpException('Bad request', 400));
  }

  let result = await req.services.userService.updateUserPassword(req.body.id, req.body.password, next)
    .catch((error: Error) => {
      return next(error);
    });
  if (!result) return next(new HttpException('User update failed', 500));

  res.status(200).json(true);
});

userRouter.put('/account/sumSelect', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.user.accounts) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req, next)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return;

  for (let account of req.body.user.accounts) {
    let result = await req.services.userService.updateUserAccountSelect(user._id, account, next)
      .catch((error: Error) => {
        return next(error);
      });
    if (!result) return next(new HttpException('User account sumSelect update failed', 500));
  }

  res.status(200).json(true);
});

userRouter.delete('', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req, next)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return;

  let result = await req.services.userService.deleteUser(user._id, next)
    .catch((error: Error) => {
      return next(error);
    });
  if (!result) return next(new HttpException('User removal failed', 500));

  res.status(200).json(true);
});
