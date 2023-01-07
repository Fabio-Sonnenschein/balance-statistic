import {
  Request,
  Response,
  NextFunction,
  Router
} from 'express';
import {HttpException} from '../exceptions/http.exception';
import {User} from '../models/user';
import {ObjectId} from 'mongodb';

export const userRouter: Router = Router();

userRouter.get('/id/:userId/:userToken', async (req: Request, res: Response, next: NextFunction) => {
  let user: User = await req.services.authService.authToken(req.params.userToken, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let returnUser: User = await req.services.userService.getUserById(new ObjectId(req.params.userId))
    .catch((error: Error) => {
      return next(error);
    });
  if (!returnUser) return next(new HttpException('User not found', 404));

  res.status(200).json(returnUser);
});

userRouter.put('/name', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.user.name) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.userService.updateUserName(user._id, req.body.user.name)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('User update failed.', 500));

  res.status(200).json(true);
});

userRouter.put('/email', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.user.email) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.userService.updateUserEmail(user._id, req.body.user.email)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('User update failed', 500));

  res.status(200).json(true);
});

userRouter.put('/password', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.user.password) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.userService.updateUserPassword(user._id, req.body.user.password)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('User update failed', 500));

  res.status(200).json(true);
});

userRouter.put('/account/sumSelect', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.user.accounts) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  for (let account of req.body.user.accounts) {
    let update = await req.services.userService.updateUserAccountSelect(user._id, account)
      .catch((error: Error) => {
        return next(error);
      });
    if (!update) return next(new HttpException('User update failed', 500));
  }

  res.status(200).json(true);
});

userRouter.delete('', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let deleteQuery = await req.services.userService.deleteUser(user._id)
    .catch((error: Error) => {
      return next(error);
    });
  if (!deleteQuery) return next(new HttpException('User removal failed', 500));

  res.status(200).json(true);
});
