import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express';
import {plainToInstance} from 'class-transformer';
import {User} from '../models/user';
import {HttpException} from '../exceptions/http.exception';

export const authRouter: Router = Router();

authRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  let user: User = plainToInstance(User, req.body);
  if (!req.services.userService.validateUser(user)) {
    return next(new HttpException('User invalid', 400));
  }

  let result = await req.services.userService.insertUser(user, next)
    .catch((error: Error) => {
      return next(error);
    });
  if (!result) return next(new HttpException('Registration failed', 500));
  if (!result.acknowledged) return next(new HttpException('Server error', 500));
  let session = await req.services.authService.generateToken(result.insertedId, req, next)
    .catch((error: Error) => {
      return next(error);
    });
  res.status(200).json(session);
});

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.email || !req.body.password) {
    return next(new HttpException('Bad request', 400));
  }

  let user = await req.services.authService.authUser(req.body.email, req.body.password, req, next)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return;

  res.status(200).json(user);
});

authRouter.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token) {
    return next(new HttpException('Bad request', 400));
  }

  let user = await req.services.authService.authToken(req.body.token, req, next)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return;

  await req.services.userService.unsetToken(user._id, next).catch((error: Error) => {
    return next(Error);
  });

  res.status(200).json(true);
});
