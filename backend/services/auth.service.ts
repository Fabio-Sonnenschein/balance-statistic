import hat from 'hat';
import {collections} from './database.service';
import {HttpException} from '../exceptions/http.exception';
import {sha512} from 'js-sha512';
import {ObjectId} from 'mongodb';
import {
  NextFunction,
  Request
} from 'express';

export class AuthService {
  rack: any;

  constructor() {
    this.rack = hat.rack();
  }

  async authUser(email: string, password: string, req: Request, next: NextFunction) {
    let user = await req.services.userService.getUserByEmail(email, next);
    if (!user) {
      return next(new HttpException('Invalid credentials', 401));
    } else if (user.password != sha512(password)) {
      return next(new HttpException('Invalid credentials', 401));
    }
    return this.generateToken(user._id, req, next);
  }

  async authToken(token: string, req: Request, next: NextFunction) {
    let user = await req.services.userService.getUserByToken(token, next);
    if (!user || user.session.expires < Date.now()) {
      return next(new HttpException('Invalid token', 401));
    }
    return req.services.userService.projectUser(user,
      false,
      false,
      false,
      true,
      true,
      true);
  }

  async generateToken(userId: ObjectId, req: Request, next: NextFunction) {
    let token = this.rack();
    let expires = new Date(Date.now() + Number(process.env.TOKEN_EXPIRATION_TIME));
    await req.services.userService.setToken(userId, token, expires, next)
      .catch((error: Error) => {
        return next(error);
      });
    let user = await req.services.userService.getUserById(userId, next);
    return req.services.userService.projectUser(user,
      false,
      false,
      true,
      false,
      false,
      false);
  }
}