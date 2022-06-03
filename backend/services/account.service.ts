import {Account} from "../models/account";
import {collections} from "./database.service";
import {HttpException} from "../exceptions/http.exception";
import {Document, ObjectId} from "mongodb";

export class AccountService {
    async insertAccount(userId: ObjectId, account: Account) {
        let existingAccount = await collections.account.findOne({number: account.number});
        if (existingAccount) throw new HttpException('Account number has already been used', 409);

        let insertQuery = await collections.account.insertOne(account);
        if (!insertQuery.acknowledged) {
            throw new HttpException('Account insertion failed', 500);
        } else {
            let updateQuery = await collections.user.updateOne({_id: userId}, {$push: {accounts: insertQuery.insertedId}});
            if (updateQuery.modifiedCount !== 1) {
                throw new HttpException('User update failed on Account insertion', 500);
            } else {
                return true;
            }
        }
    }

    async updateAccount(number: string, account: Account) {
        let updateQuery = await collections.account.updateOne({number: number}, {$set: {name: account.name, number: account.number, balance: account.balance, provider: account.provider, type: account.type}});
        if (!updateQuery.acknowledged) {
            throw new HttpException('Account update failed', 500);
        } else {
            return true;
        }
    }

    async removeAccount(account: Account) {
        let accountQuery = await collections.account.findOne({number: account.number});
        if (!accountQuery) {
            throw new HttpException('Account to be remove does not exist', 500);
        } else {
            let collection: Document = collections.user; // Some sort of TS / MongoDB Error requires this...
            let updateQuery = await collection.updateMany({accounts: accountQuery._id}, {$pull: {accounts: accountQuery._id}});
            let deleteQuery = await collections.account.deleteOne({number: account.number});
            if (!deleteQuery.acknowledged) {
                throw new HttpException('Account removal failed', 500);
            } else {
                return true;
            }
        }
    }
}