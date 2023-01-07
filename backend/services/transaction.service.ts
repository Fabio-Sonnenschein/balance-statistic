import {Transaction} from '../models/transaction';
import {ObjectId} from 'mongodb';
import {HttpException} from '../exceptions/http.exception';
import {collections} from './database.service';
import {TransactionStatus} from '../models/transaction-status';

export class TransactionService {
  async getTransactionById(transactionId: ObjectId) {
    let transaction = await collections.transaction.findOne<Transaction>({
      _id: new ObjectId(transactionId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!transaction) throw new HttpException('No transaction found', 404);
    return transaction;
  }

  async getTransactionsByUser(userId: ObjectId, count: number, offset: number) {
    // TODO: Add query!
  }

  async insertTransaction(userId: ObjectId, transaction: Transaction) {
    let insertQuery = await collections.transaction.insertOne(transaction)
      .catch((error: Error) => {
        throw error;
      });
    if (!insertQuery.acknowledged) throw new HttpException('Transaction insertion failed', 500);
    return insertQuery.insertedId;
  }

  async updateTransactionCategory(userId: ObjectId, transactionId: ObjectId, category: string) {
    let transaction = await collections.transaction.findOne<Transaction>({
      _id: new ObjectId(transactionId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!transaction) throw new HttpException('Transaction does not exist', 404);

    if (!this.checkTransactionOwnership(transaction, userId)) {
      throw new HttpException('Transaction update is unauthorized', 401);
    }

    let updateQuery = await collections.transaction.updateOne({
      _id: new ObjectId(transactionId)
    }, {
      $set: {
        category: category
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Transaction update failed', 500);
    return true;
  }

  async updateTransactionDescription(userId: ObjectId, transactionId: ObjectId, description: string) {
    let transaction = await collections.transaction.findOne<Transaction>({
      _id: new ObjectId(transactionId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!transaction) throw new HttpException('Transaction does not exist', 404);

    if (!this.checkTransactionOwnership(transaction, userId)) {
      throw new HttpException('Transaction update is unauthorized', 401);
    }

    let updateQuery = await collections.transaction.updateOne({
      _id: new ObjectId(transactionId)
    }, {
      $set: {
        description: description
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Transaction update failed', 500);
    return true;
  }

  async removeTransaction(userId: ObjectId, transactionId: ObjectId) {
    let transaction = await collections.transaction.findOne<Transaction>({
      _id: transactionId
    }).catch((error: Error) => {
      throw error;
    });
    if (!transaction) throw new HttpException('Transaction does not exist', 404);

    if (!this.checkTransactionOwnership(transaction, userId)) {
      throw new HttpException('Transaction access violation', 401);
    }

    if (transaction.status !== TransactionStatus.REGISTERED &&
      transaction.status !== TransactionStatus.FAILED) {
      throw new HttpException('A completed or queued transaction cannot be removed', 401);
    }

    let deleteQuery = await collections.transaction.deleteOne({
      _id: new ObjectId(transactionId)
    });
    if (!deleteQuery.acknowledged) throw new HttpException('Transaction removal failed', 500);
    return true;
  }

  checkTransactionAffiliation(transaction: Transaction, userId: ObjectId) {
    if (transaction.sender.senderId === userId ||
      transaction.receiver.receiverId === userId ||
      this.checkTransactionOwnership(transaction, userId)) {
      return true;
    }
    throw new HttpException('Transaction access violation', 401);
  }

  checkTransactionOwnership(transaction: Transaction, userId: ObjectId) {
    if (transaction.owner !== userId) throw new HttpException('Transaction access violation', 401);
    return true;
  }
}
