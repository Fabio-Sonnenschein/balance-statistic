import {collections} from './database.service';
import {HttpException} from '../exceptions/http.exception';
import {
  AccountObject,
  User
} from '../models/user';
import {sha512} from 'js-sha512';
import {ObjectId} from 'mongodb';

export class UserService {
  async getUserById(userId: ObjectId) {
    let user: User = await collections.user.findOne<User>({
      _id: new ObjectId(userId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  async getUserByToken(token: string) {
    let user: User = await collections.user.findOne<User>({
      'session.token': token
    }).catch((error: Error) => {
      throw error;
    });
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  async getUserByEmail(email: string) {
    let user: User = await collections.user.findOne<User>({
      email: email
    }).catch((error: Error) => {
      throw error;
    });
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  async insertUser(user: User) {
    let existingUser = await collections.user.findOne<User>({
      email: user.email
    }).catch((error: Error) => {
      throw error;
    });
    if (existingUser) throw new HttpException('Email already registered', 409);

    user.password = sha512(user.password);
    let insertQuery = await collections.user.insertOne(user);
    if (!insertQuery.acknowledged) throw new HttpException('User creation failed', 500);
    return insertQuery.insertedId;
  }

  async setToken(userId: ObjectId, token: string, expires: Date) {
    let updateQuery = await collections.user.updateOne({
      _id: new ObjectId(userId)
    }, {
      $set: {
        session: {
          token: token,
          expires: expires
        }
      }
    });
    if (!updateQuery.acknowledged) throw new HttpException('Token update failed', 500);
    return true;
  }

  async unsetToken(userId: ObjectId) {
    let updateQuery = await collections.user.updateOne({
      _id: new ObjectId(userId)
    }, {
      $set: {
        session: {
          token: null,
          expires: Date.now()
        }
      }
    });
    if (updateQuery.acknowledged) throw new HttpException('Token update failed', 500);
    return true;
  }

  async deleteUser(userId: ObjectId) {
    let user = await collections.user.deleteOne({
      _id: new ObjectId(userId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!user.acknowledged) throw new HttpException('User removal failed', 500);
    return true;
  }

  async updateUserName(userId: ObjectId, name: string) {
    let query = await collections.user.updateOne({
      _id: new ObjectId(userId)
    }, {
      $set: {
        name: name
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!query.acknowledged) throw new HttpException('User update failed', 500);
    return true;
  }

  async updateUserEmail(userId: ObjectId, email: string) {
    let query = await collections.user.updateOne({
      _id: new ObjectId(userId)
    }, {
      $set: {
        email: email
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!query.acknowledged) throw new HttpException('User update failed', 500);
    return true;
  }

  async updateUserPassword(userId: ObjectId, password: string) {
    password = sha512(password);
    let query = await collections.user.updateOne({
      _id: new ObjectId(userId)
    }, {
      $set: {
        password: password
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!query.acknowledged) throw new HttpException('User update failed', 500);
    return true;
  }

  async updateUserAccountSelect(userId: ObjectId, account: AccountObject) {
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
    }).catch((error: Error) => {
      throw error;
    });
    if (!query.acknowledged) throw new HttpException('User update failed', 500);
    return true;
  }

  validateUser(user: User) {
    if (!(user.email && user.name && user.password)) return false;
    if ((/[^@ \\trn]+@[^@ \\trn]+\\.[^@ \\trn]+/).test(user.email)) return false;
    if (user.password.length < 8) return false;
    return true;
  }

  projectUser(user: User,
              options: {
                name?: boolean,
                email?: boolean,
                session?: boolean,
                accounts?: boolean,
                budget?: boolean,
                savingGoals?: boolean
              } = {
                name: false,
                email: false,
                session: false,
                accounts: false,
                budget: false,
                savingGoals: false
              }) {
    if (!options.name) delete user.name;
    if (!options.email) delete user.email;
    delete user.password; // For security reasons, the password hash must not be sent from the server to any client.
    if (!options.session) delete user.session;
    if (!options.accounts) delete user.accounts;
    if (!options.budget) delete user.budget;
    if (!options.savingGoals) delete user.savingGoals;
    return user;
  }
}
