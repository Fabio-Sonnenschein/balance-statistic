import {
  AccessPolicy,
  Account
} from '../models/account';
import {collections} from './database.service';
import {HttpException} from '../exceptions/http.exception';
import {
  Document,
  ObjectId
} from 'mongodb';

export class AccountService {
  async insertAccount(userId: ObjectId, account: Account) {
    let existingAccount = await collections.account.findOne<Account>({
      number: account.number
    }).catch((error: Error) => {
      throw error;
    });
    if (existingAccount) throw new HttpException('Account number is already in used', 409);

    let insertQuery = await collections.account.insertOne(account).catch((error: Error) => {
      throw error;
    });
    if (!insertQuery.acknowledged) throw new HttpException('Account insertion failed', 500);

    let updateQuery = await collections.user.updateOne({
      _id: new ObjectId(userId)
    }, {
      $push: {
        accounts: {
          account: insertQuery.insertedId,
          sumSelect: true
        }
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) {
      throw new HttpException('User update failed on Account insertion', 500);
    }
    return true;
  }

  async getAccount(accountId: ObjectId, userId: ObjectId) {
    let account = await collections.account.findOne<Account>({
      _id: new ObjectId(accountId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!account) throw new HttpException('No account with this ID found', 404);

    if (!this.checkAccountAffiliation(account.access, userId)) {
      throw new HttpException('Account request is unauthorized', 401);
    }
    return account;
  }

  async getAccountsByUser(userId: ObjectId) {
    return await collections.user.aggregate([
      {
        '$match': {
          '_id': new ObjectId(userId)
        }
      }, {
        '$project': {
          '_id': 0,
          'accounts': 1
        }
      }, {
        '$lookup': {
          'from': 'account',
          'localField': 'accounts.account',
          'foreignField': '_id',
          'as': 'temp'
        }
      }, {
        '$project': {
          'accounts': {
            '$map': {
              'input': '$temp',
              'in': {
                '$let': {
                  'vars': {
                    'i': {
                      '$arrayElemAt': [
                        {
                          '$filter': {
                            'input': '$accounts',
                            'cond': {
                              '$eq': [
                                '$$account.account', '$$this._id'
                              ]
                            },
                            'as': 'account'
                          }
                        }, 0
                      ]
                    }
                  },
                  'in': {
                    '$mergeObjects': [
                      '$$this', {
                        'sumSelect': '$$i.sumSelect'
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      }, {
        '$unwind': {
          'path': '$accounts',
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$replaceRoot': {
          'newRoot': '$accounts'
        }
      }
    ]).toArray();
  }

  async updateAccountNumber(userId: ObjectId, accountId: ObjectId, number: string) {
    let account = await collections.account.findOne<Account>({
      _id: new ObjectId(accountId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!account) throw new HttpException('Account does not exist', 500);

    if (!this.checkAccountAffiliation(account.access, userId)) {
      throw new HttpException('Account update is unauthorized', 401);
    }

    let result = await collections.account.updateOne({
      _id: new ObjectId(accountId)
    }, {
      $set: {
        number: number
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!result.acknowledged) throw new HttpException('Account update failed', 500);
    return true;
  }

  async updateAccountName(userId: ObjectId, accountId: ObjectId, name: string) {
    let account = await collections.account.findOne<Account>({
      _id: new ObjectId(accountId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!account) throw new HttpException('Account does not exist', 500);

    if (!this.checkAccountAffiliation(account.access, userId)) {
      throw new HttpException('Account update is unauthorized', 401);
    }

    let result = await collections.account.updateOne({
      _id: new ObjectId(accountId)
    }, {
      $set: {
        name: name
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!result.acknowledged) throw new HttpException('Account update failed', 500);
    return true;
  }

  async updateAccountBalance(userId: ObjectId, accountId: ObjectId, balance: number) {
    let account = await collections.account.findOne<Account>({
      _id: new ObjectId(accountId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!account) throw new HttpException('Account does not exist', 500);

    if (!this.checkAccountAffiliation(account.access, userId)) {
      throw new HttpException('Account update is unauthorized', 401);
    }

    let result = await collections.account.updateOne({
      _id: new ObjectId(accountId)
    }, {
      $set: {
        balance: balance
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!result.acknowledged) throw new HttpException('Account update failed', 500);
    return true;
  }

  async updateAccountProvider(userId: ObjectId, accountId: ObjectId, provider: number) {
    let account = await collections.account.findOne<Account>({
      _id: new ObjectId(accountId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!account) throw new HttpException('Account does not exist', 500);

    if (!this.checkAccountAffiliation(account.access, userId)) {
      throw new HttpException('Account update is unauthorized', 401);
    }

    let result = await collections.account.updateOne({
      _id: new ObjectId(accountId)
    }, {
      $set: {
        provider: provider
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!result.acknowledged) throw new HttpException('Account update failed', 500);
    return true;
  }

  async updateAccountType(userId: ObjectId, accountId: ObjectId, type: string) {
    let account = await collections.account.findOne<Account>({
      _id: new ObjectId(accountId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!account) throw new HttpException('Account does not exist', 500);

    if (!this.checkAccountAffiliation(account.access, userId)) {
      throw new HttpException('Account update is unauthorized', 401);
    }

    let result = await collections.account.updateOne({
      _id: new ObjectId(accountId)
    }, {
      $set: {
        type: type
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!result.acknowledged) throw new HttpException('Account update failed', 500);
    return true;
  }

  async updateAccountCurrency(userId: ObjectId, accountId: ObjectId, currency: string) {
    let account = await collections.account.findOne<Account>({
      _id: new ObjectId(accountId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!account) throw new HttpException('Account does not exist', 500);

    if (!this.checkAccountAffiliation(account.access, userId)) {
      throw new HttpException('Account update is unauthorized', 401);
    }

    let result = await collections.account.updateOne({
      _id: new ObjectId(accountId)
    }, {
      $set: {
        currency: currency
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!result.acknowledged) throw new HttpException('Account update failed', 500);
    return true;
  }

  async updateAccountSubscriberAdd(userId: ObjectId, accountId: ObjectId, subscriberId: ObjectId) {
    let account = await collections.account.findOne<Account>({
      _id: new ObjectId(accountId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!account) throw new HttpException('Account does not exist', 500);

    if (account.access.owner.toString() !== userId.toString()) {
      throw new HttpException('Account subscriber change request is not authorized', 401);
    }

    let result = await collections.account.updateOne({
      _id: new ObjectId(accountId)
    }, {
      $push: {
        'access.subscriber': new ObjectId(subscriberId)
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!result.acknowledged) throw new HttpException('Account update failed', 500);
    return true;
  }

  async updateAccountSubscriberRemove(userId: ObjectId, accountId: ObjectId, subscriberId: ObjectId) {
    let account = await collections.account.findOne<Account>({
      _id: new ObjectId(accountId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!account) throw new HttpException('Account does not exist', 500);

    if (account.access.owner.toString() !== userId.toString()) {
      throw new HttpException('Account subscriber change request is not authorized', 401);
    }

    let result = await collections.account.updateOne({
      _id: new ObjectId(accountId)
    }, {
      $pull: {
        'access.subscriber': new ObjectId(subscriberId)
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!result.acknowledged) throw new HttpException('Account update failed', 500);
    return true;
  }

  async updateAccountOwner(userId: ObjectId, accountId: ObjectId, ownerId: ObjectId) {
    let account = await collections.account.findOne<Account>({
      _id: new ObjectId(accountId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!account) throw new HttpException('Account does not exist', 500);

    if (account.access.owner.toString() !== userId.toString()) {
      throw new HttpException('Account owner change request is not authorized', 401);
    }

    let result = await collections.account.updateOne({
      _id: new ObjectId(accountId)
    }, {
      $set: {
        'access.owner': new ObjectId(ownerId)
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!result.acknowledged) throw new HttpException('Account update failed', 500);
    return true;
  }

  async removeAccount(userId: ObjectId, accountId: ObjectId) {
    let accountQuery = await collections.account.findOne<Account>({
      _id: accountId
    }).catch((error: Error) => {
      throw error;
    });
    if (!accountQuery) throw new HttpException('Account to be remove does not exist', 404);

    if (!this.checkAccountAffiliation(accountQuery.access, userId)) {
      throw new HttpException('Account update is unauthorized', 401);
    }

    let userCollection: Document = collections.user; // Some sort of TS / MongoDB Error requires this...
    await userCollection.updateMany({
      accounts: accountQuery._id
    }, {
      $pull: {
        accounts: accountQuery._id
      }
    }).catch((error: Error) => {
      throw error;
    });

    let recurrenceCollection: Document = collections.recurrence;
    await recurrenceCollection.deleteMany({
      'sender.senderAccount': accountQuery._id
    }).catch((error: Error) => {
      throw error;
    });
    await recurrenceCollection.deleteMany({
      'receiver.receiverAccount': accountQuery._id
    }).catch((error: Error) => {
      throw error;
    });

    let savingGoalCollection: Document = collections.savingGoal;
    await savingGoalCollection.deleteMany({
      account: accountQuery._id
    }).catch((error: Error) => {
      throw error;
    });

    let deleteQuery = await collections.account.deleteOne({
      _id: accountQuery._id
    }).catch((error: Error) => {
      throw error;
    });

    if (!deleteQuery.acknowledged) throw new HttpException('Account removal failed', 500);
    return true;
  }

  checkAccountAffiliation(accountAccess: AccessPolicy, userId: ObjectId) {
    if (accountAccess.owner.toString() === userId.toString() ||
      accountAccess.subscribers.toString().includes(userId.toString())) {
      return true;
    }
    throw new HttpException('Account access violation', 401);
  }
}
