import {AccessPolicy, Account} from "../models/account";
import {collections} from "./database.service";
import {HttpException} from "../exceptions/http.exception";
import {Document, ObjectId} from "mongodb";
import {NextFunction} from "express";

export class AccountService {
    async insertAccount(userId: ObjectId, account: Account, next: NextFunction) {
        let existingAccount = await collections.account.findOne({number: account.number});
        if (existingAccount) return next(new HttpException('Account number has already been used', 409));

        let insertQuery = await collections.account.insertOne(account);
        if (!insertQuery.acknowledged) {
            return next(new HttpException('Account insertion failed', 500));
        } else {
            let updateQuery = await collections.user.updateOne({_id: new ObjectId(userId)}, {$push: {accounts: {account: insertQuery.insertedId, sumSelect: true}}});
            if (updateQuery.modifiedCount !== 1) {
                return next(new HttpException('User update failed on Account insertion', 500));
            } else {
                return true;
            }
        }
    }

    async getAccount(accountId: ObjectId, userId: ObjectId, next: NextFunction) {
        let account = await collections.account.findOne({_id: new ObjectId(accountId)});
        if (!account) return next(new HttpException('No account with this ID found', 404));
        if (this.checkAccountAffiliation(account.access, userId, next)) {
            return account;
        } else {
            return next(new HttpException('Account request is unauthorized', 401));
        }
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

    async updateAccountNumber(userId: ObjectId, accountId: ObjectId, number: string, next: NextFunction) {
        let account = await collections.account.findOne({_id: new ObjectId(accountId)});
        if (!account) {
            return next(new HttpException('Account does not exist', 500));
        } else {
            if (this.checkAccountAffiliation(account.access, userId, next)) {
                let result = await collections.account.updateOne({_id: new ObjectId(accountId)}, {$set: {number: number}});
                if (result.modifiedCount !== 1) {
                    return next(new HttpException('Account update failed', 500));
                } else {
                    return true;
                }
            } else {
                return next(new HttpException('Account update is unauthorized', 401));
            }
        }
    }

    async updateAccountName(userId: ObjectId, accountId: ObjectId, name: string, next: NextFunction) {
        let account = await collections.account.findOne({_id: new ObjectId(accountId)});
        if (!account) {
            return next(new HttpException('Account does not exist', 500));
        } else {
            if (this.checkAccountAffiliation(account.access, userId, next)) {
                let result = await collections.account.updateOne({_id: new ObjectId(accountId)}, {$set: {name: name}});
                if (result.modifiedCount !== 1) {
                    return next(new HttpException('Account update failed', 500));
                } else {
                    return true;
                }
            } else {
                return next(new HttpException('Account update is unauthorized', 401));
            }
        }
    }

    async updateAccountBalance(userId: ObjectId, accountId: ObjectId, balance: number, next: NextFunction) {
        let account = await collections.account.findOne({_id: new ObjectId(accountId)});
        if (!account) {
            return next(new HttpException('Account does not exist', 500));
        } else {
            if (this.checkAccountAffiliation(account.access, userId, next)) {
                let result = await collections.account.updateOne({_id: new ObjectId(accountId)}, {$set: {balance: balance}});
                if (result.modifiedCount !== 1) {
                    return next(new HttpException('Account update failed', 500));
                } else {
                    return true;
                }
            } else {
                return next(new HttpException('Account update is unauthorized', 401));
            }
        }
    }

    async updateAccountProvider(userId: ObjectId, accountId: ObjectId, provider: number, next: NextFunction) {
        let account = await collections.account.findOne({_id: new ObjectId(accountId)});
        if (!account) {
            return next(new HttpException('Account does not exist', 500));
        } else {
            if (this.checkAccountAffiliation(account.access, userId, next)) {
                let result = await collections.account.updateOne({_id: new ObjectId(accountId)}, {$set: {provider: provider}});
                if (result.modifiedCount !== 1) {
                    return next(new HttpException('Account update failed', 500));
                } else {
                    return true;
                }
            } else {
                return next(new HttpException('Account update is unauthorized', 401));
            }
        }
    }

    async updateAccountType(userId: ObjectId, accountId: ObjectId, type: string, next: NextFunction) {
        let account = await collections.account.findOne({_id: new ObjectId(accountId)});
        if (!account) {
            return next(new HttpException('Account does not exist', 500));
        } else {
            if (this.checkAccountAffiliation(account.access, userId, next)) {
                let result = await collections.account.updateOne({_id: new ObjectId(accountId)}, {$set: {type: type}});
                if (result.modifiedCount !== 1) {
                    return next(new HttpException('Account update failed', 500));
                } else {
                    return true;
                }
            } else {
                return next(new HttpException('Account update is unauthorized', 401));
            }
        }
    }

    async updateAccountCurrency(userId: ObjectId, accountId: ObjectId, currency: string, next: NextFunction) {
        let account = await collections.account.findOne({_id: new ObjectId(accountId)});
        if (!account) {
            return next(new HttpException('Account does not exist', 500));
        } else {
            if (this.checkAccountAffiliation(account.access, userId, next)) {
                let result = await collections.account.updateOne({_id: new ObjectId(accountId)}, {$set: {currency: currency}});
                if (result.modifiedCount !== 1) {
                    return next(new HttpException('Account update failed', 500));
                } else {
                    return true;
                }
            } else {
                return next(new HttpException('Account update is unauthorized', 401));
            }
        }
    }

    async updateAccountSubscriberAdd(userId: ObjectId, accountId: ObjectId, subscriberId: ObjectId, next: NextFunction) {
        let account = await collections.account.findOne({_id: new ObjectId(accountId)});
        if (!account) {
            return next(new HttpException('Account does not exist', 500));
        } else {
            if (account.access.owner.toString() === userId.toString()) {
                let result = await collections.account.updateOne({_id: new ObjectId(accountId)}, {$push: {'access.subscriber': new ObjectId(subscriberId)}});
                if (result.modifiedCount !== 1) {
                    return next(new HttpException('Account update failed', 500));
                } else {
                    return true;
                }
            } else {
                return next(new HttpException('Account subscriber change request is not ordered by current owner', 401));
            }
        }
    }

    async updateAccountSubscriberRemove(userId: ObjectId, accountId: ObjectId, subscriberId: ObjectId, next: NextFunction) {
        let account = await collections.account.findOne({_id: new ObjectId(accountId)});
        if (!account) {
            return next(new HttpException('Account does not exist', 500));
        } else {
            if (account.access.owner.toString() === userId.toString()) {
                let result = await collections.account.updateOne({_id: new ObjectId(accountId)}, {$pull: {'access.subscriber': new ObjectId(subscriberId)}});
                if (result.modifiedCount !== 1) {
                    return next(new HttpException('Account update failed', 500));
                } else {
                    return true;
                }
            } else {
                return next(new HttpException('Account subscriber change request is not ordered by current owner', 401));
            }
        }
    }

    async updateAccountOwner(userId: ObjectId, accountId: ObjectId, ownerId: ObjectId, next: NextFunction) {
        let account = await collections.account.findOne({_id: new ObjectId(accountId)});
        if (!account) {
            return next(new HttpException('Account does not exist', 500));
        } else {
            if (account.access.owner.toString() === userId.toString()) {
                let result = await collections.account.updateOne({_id: new ObjectId(accountId)}, {$set: {'access.owner': new ObjectId(ownerId)}});
                if (result.modifiedCount !== 1) {
                    return next(new HttpException('Account update failed', 500));
                } else {
                    return true;
                }
            } else {
                return next(new HttpException('Account owner change request is not ordered by current owner', 401));
            }
        }
    }

    async removeAccount(userId: ObjectId, accountId: ObjectId, next: NextFunction) {
        let accountQuery = await collections.account.findOne({_id: accountId});
        if (!accountQuery) {
            return next(new HttpException('Account to be remove does not exist', 500));
        } else {
            if (this.checkAccountAffiliation(accountQuery.access, userId, next)) {
                let userCollection: Document = collections.user; // Some sort of TS / MongoDB Error requires this...
                await userCollection.updateMany({accounts: accountQuery._id}, {$pull: {accounts: accountQuery._id}});
                let recurrenceCollection: Document = collections.recurrence;
                await recurrenceCollection.deleteMany({'sender.senderAccount': accountQuery._id});
                await recurrenceCollection.deleteMany({'receiver.receiverAccount': accountQuery._id});
                let savingGoalCollection: Document = collections.savingGoal;
                await savingGoalCollection.deleteMany({account: accountQuery._id});
                let deleteQuery = await collections.account.deleteOne({_id: accountQuery._id});
                if (!deleteQuery.acknowledged) {
                    return next(new HttpException('Account removal failed', 500));
                } else {
                    return true;
                }
            } else {
                return next(new HttpException('Account update is unauthorized', 401));
            }
        }
    }

    checkAccountAffiliation(accountAccess: AccessPolicy, userId: ObjectId, next: NextFunction) {
        if (accountAccess.owner.toString() === userId.toString() || accountAccess.subscribers.toString().includes(userId.toString())) {
            return true;
        } else {
            return next(new HttpException('Account access violation', 401));
        }
    }
}