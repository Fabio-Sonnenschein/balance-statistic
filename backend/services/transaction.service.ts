import {Transaction} from '../models/transaction';
import {ObjectId} from 'mongodb';
import {NextFunction} from 'express';
import {HttpException} from '../exceptions/http.exception';
import {collections} from './database.service';
import {TransactionStatus} from '../models/transaction-status';

export class TransactionService {
  async getTransactionById(transactionId: ObjectId, next: NextFunction) {
    let transaction = await collections.transaction.findOne<Transaction>({_id: new ObjectId(transactionId)});
    if (!transaction) return next(new HttpException('No transaction found', 404));
    return transaction;
  }

  async getTransactionsByUser(userId: ObjectId, count: number, offset: number, next: NextFunction) {

  }

  async insertTransaction(userId: ObjectId, transaction: Transaction, next: NextFunction) {
    let insertQuery = await collections.transaction.insertOne(transaction);
    if (!insertQuery.acknowledged) {
      return next(new HttpException('Transaction insertion failed', 500));
    }
    return insertQuery.insertedId;
  }

  async updateTransactionCategory(userId: ObjectId, transactionId: ObjectId, category: string, next: NextFunction) {
    let transaction = await collections.transaction.findOne<Transaction>({_id: new ObjectId(transactionId)});
    if (!transaction) return next(new HttpException('Transaction does not exist', 404));
    if (!this.checkTransactionOwnership(transaction, userId, next)) {
      return next(new HttpException('Transaction update is unauthorized', 401));
    }
    let result = await collections.transaction.updateOne({_id: new ObjectId(transactionId)}, {$set: {category: category}});
    if (result.modifiedCount !== 1) {
      return next(new HttpException('Transaction update failed', 500));
    }
    return true;
  }

  async updateTransactionDescription(userId: ObjectId, transactionId: ObjectId, description: string, next: NextFunction) {
    let transaction = await collections.transaction.findOne<Transaction>({_id: new ObjectId(transactionId)});
    if (!transaction) return next(new HttpException('Transaction does not exist', 404));
    if (!this.checkTransactionOwnership(transaction, userId, next)) {
      return next(new HttpException('Transaction update is unauthorized', 401));
    }
    let result = await collections.transaction.updateOne({_id: new ObjectId(transactionId)}, {$set: {description: description}});
    if (result.modifiedCount !== 1) {
      return next(new HttpException('Transaction update failed', 500));
    }
    return true;
  }

  async removeTransaction(userId: ObjectId, transactionId: ObjectId, next: NextFunction) {
    let transaction = await collections.transaction.findOne<Transaction>({_id: transactionId});
    if (this.checkTransactionOwnership(transaction, userId, next)) {
      if (transaction.status === TransactionStatus.REGISTERED ||
        transaction.status === TransactionStatus.FAILED) {
        let deleteQuery = await collections.transaction.deleteOne({_id: new ObjectId(transactionId)});
        if (!deleteQuery.acknowledged) return next(new HttpException('Transaction removal failed', 500));
        return true;
      }
      return next(new HttpException('A completed or queued transaction cannot be removed', 401));
    }
    return next(new HttpException('Transaction access violation', 401));
  }

  checkTransactionAffiliation(transaction: Transaction, userId: ObjectId, next: NextFunction) {
    if (transaction.sender.senderId === userId ||
      transaction.receiver.receiverId === userId ||
      this.checkTransactionOwnership(transaction, userId, next)) {
      return true;
    }
    return next(new HttpException('Transaction access violation', 401));
  }

  checkTransactionOwnership(transaction: Transaction, userId: ObjectId, next: NextFunction) {
    if (transaction.owner !== userId) return next(new HttpException('Transaction access violation', 401));
    return true;
  }
}