import hat from 'hat';
import {HttpException} from '../exceptions/http.exception';
import {sha512} from 'js-sha512';
import {ObjectId} from 'mongodb';
import {
  Request
} from 'express';

export class AuthService {
  rack: any;

  constructor() {
    this.rack = hat.rack();
  }

  async authUser(email: string, password: string, req: Request) {
    let user = await req.services.userService.getUserByEmail(email)
      .catch((error: Error) => {
        throw error;
      });
    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    } else if (user.password != sha512(password)) {
      throw new HttpException('Invalid credentials', 401);
    }
    return this.generateToken(user._id, req)
      .catch((error: Error) => {
        throw error;
      });
  }

  async authToken(token: string, req: Request) {
    let user = await req.services.userService.getUserByToken(token)
      .catch((error: Error) => {
        throw error;
      });
    if (!user || user.session.expires < Date.now()) {
      throw new HttpException('Invalid token', 401);
    }
    return req.services.userService.projectUser(user,
      {
        accounts: true,
        budget: true,
        savingGoals: true
      });
  }

  async generateToken(userId: ObjectId, req: Request) {
    let token = this.rack();
    let expires = new Date(Date.now() + Number(process.env.TOKEN_EXPIRATION_TIME));
    await req.services.userService.setToken(userId, token, expires)
      .catch((error: Error) => {
        throw error;
      });
    let user = await req.services.userService.getUserById(userId)
      .catch((error: Error) => {
        throw error;
      });
    return req.services.userService.projectUser(user,
      {
        session: true
      });
  }
}
