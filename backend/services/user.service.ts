import {collections} from './database.service';
import {HttpException} from '../exceptions/http.exception';
import {
  AccountObject,
  User
} from '../models/user';
import {sha512} from 'js-sha512';
import {ObjectId} from 'mongodb';
import {NextFunction} from 'express';

export class UserService {
  async getUserById(userId: ObjectId, next: NextFunction) {
    return await collections.user.findOne<User>({_id: new ObjectId(userId)})
      .catch((error: Error) => {
        return next(error);
      });
  }

  async getUserByToken(token: string, next: NextFunction) {
    return await collections.user.findOne<User>({'session.token': token})
      .catch((error: Error) => {
        return next(error);
      });
  }

  async getUserByEmail(email: string, next: NextFunction) {
    return await collections.user.findOne<User>({email: email})
      .catch((error: Error) => {
        return next(error);
      });
  }

  async insertUser(user: User, next: NextFunction) {
    let existingUser = await collections.user.findOne<User>({email: user.email});
    if (existingUser) return next(new HttpException('Email already registered', 409));

    user.password = sha512(user.password);
    return collections.user.insertOne(user);
  }

  async setToken(userId: ObjectId, token: string, expires: Date, next: NextFunction) {
    let updateQuery = await collections.user.updateOne({_id: new ObjectId(userId)}, {
      $set: {
        session: {
          token: token,
          expires: expires
        }
      }
    });
    if (updateQuery.modifiedCount !== 1) {
      return next(new HttpException('Token update failed', 500));
    }
    return true;
  }

  async unsetToken(userId: ObjectId, next: NextFunction) {
    let updateQuery = await collections.user.updateOne({_id: new ObjectId(userId)}, {
      $set: {
        session: {
          token: null,
          expires: Date.now()
        }
      }
    });
    if (updateQuery.modifiedCount !== 1) {
      return next(new HttpException('Token update failed', 500));
    }
    return true;
  }

  async deleteUser(userId: ObjectId, next: NextFunction) {
    let user = collections.user.deleteOne({_id: new ObjectId(userId)});
    if (!user) {
      return next(new HttpException('User removal failed', 500));
    }
    return true;
  }

  async updateUserName(userId: ObjectId, name: string, next: NextFunction) {
    let query = await collections.user.updateOne({_id: new ObjectId(userId)}, {$set: {name: name}});
    if (query.modifiedCount !== 1) {
      return next(new HttpException('User update failed', 500));
    }
    return true;
  }

  async updateUserEmail(userId: ObjectId, email: string, next: NextFunction) {
    let query = await collections.user.updateOne({_id: new ObjectId(userId)}, {$set: {email: email}});
    if (query.modifiedCount !== 1) {
      return next(new HttpException('User update failed', 500));
    }
    return true;
  }

  async updateUserPassword(userId: ObjectId, password: string, next: NextFunction) {
    password = sha512(password);
    let query = await collections.user.updateOne({_id: new ObjectId(userId)}, {$set: {password: password}});
    if (query.modifiedCount !== 1) {
      return next(new HttpException('User update failed', 500));
    }
    return true;
  }

  async updateUserAccountSelect(userId: ObjectId, account: AccountObject, next: NextFunction) {
    // TODO: Check if this query is working as intended
    let query = await collections.user.updateOne({
      $and: {
        _id: new ObjectId(userId),
        'accounts.accountId': new ObjectId(account.accountId)
      }
    }, {
      $set: {
        'accounts.sumSelect': account.sumSelect
      }
    });
    if (query.modifiedCount !== 1) {
      return next(new HttpException('User update failed', 500));
    }
    return true;
  }

  validateUser(user: User) {
    if (!(user.email && user.name && user.password)) return false;
    if ((/[^@ \\trn]+@[^@ \\trn]+\\.[^@ \\trn]+/).test(user.email)) return false;
    if (user.password.length < 8) return false;
    return true;
  }

  projectUser(user: User,
              name: boolean,
              email: boolean,
              session: boolean,
              accounts: boolean,
              budget: boolean,
              savingGoals: boolean) {
    if (!name) delete user.name;
    if (!email) delete user.email;
    delete user.password; // For security reasons, the password hash must not be sent from the server to any client.
    if (!session) delete user.session;
    if (!accounts) delete user.accounts;
    if (!budget) delete user.budget;
    if (!savingGoals) delete user.savingGoals;
    return user;
  }
}