import {Recurrence} from '../models/recurrence';
import {AccountObject} from '../models/user';
import {NextFunction} from 'express';
import {HttpException} from '../exceptions/http.exception';
import {ObjectId} from 'mongodb';
import {collections} from './database.service';
import {
  Receiver,
  Sender
} from '../models/transaction';

export class RecurrenceService {
  async insertRecurrence(recurrence: Recurrence, next: NextFunction) {
    let insertQuery = await collections.recurrence.insertOne(recurrence);
    if (!insertQuery.acknowledged) {
      return next(new HttpException('Recurrence insertion failed', 500));
    }
    return insertQuery.insertedId;
  }

  async getRecurrenceById(recurrenceId: ObjectId, next: NextFunction) {
    let recurrence = await collections.recurrence.findOne({_id: new ObjectId(recurrenceId)});
    if (!recurrence) return next(new HttpException('No recurrence found', 404));
    return recurrence;
  }

  async updateRecurrenceName(userId: ObjectId, recurrenceId: ObjectId, name: string, next: NextFunction) {
    let recurrence = await collections.recurrence.findOne({_id: new ObjectId(recurrenceId)});
    if (!recurrence) {
      return next(new HttpException('Recurrence does not exist', 404));
    } else {
      if (this.checkRecurrenceOwnership(recurrence.sender, userId, next)) {
        let result = await collections.recurrence.updateOne({_id: new ObjectId(recurrenceId)}, {$set: {name: name}});
        if (result.modifiedCount !== 1) {
          return next(new HttpException('Recurrence update failed', 500));
        } else {
          return true;
        }
      } else {
        return next(new HttpException('Recurrence update is unauthorized', 401));
      }
    }
  }

  async updateRecurrenceDescription(userId: ObjectId, recurrenceId: ObjectId, description: string, next: NextFunction) {
    let recurrence = await collections.recurrence.findOne({_id: new ObjectId(recurrenceId)});
    if (!recurrence) {
      return next(new HttpException('Recurrence does not exist', 404));
    } else {
      if (this.checkRecurrenceOwnership(recurrence.sender, userId, next)) {
        let result = await collections.recurrence.updateOne({_id: new ObjectId(recurrenceId)}, {$set: {description: description}});
        if (result.modifiedCount !== 1) {
          return next(new HttpException('Recurrence update failed', 500));
        } else {
          return true;
        }
      } else {
        return next(new HttpException('Recurrence update is unauthorized', 401));
      }
    }
  }

  async updateRecurrenceCreationDate(userId: ObjectId, recurrenceId: ObjectId, creationDate: Date, next: NextFunction) {
    let recurrence = await collections.recurrence.findOne({_id: new ObjectId(recurrenceId)});
    if (!recurrence) {
      return next(new HttpException('Recurrence does not exist', 404));
    } else {
      if (!this.checkRecurrenceOwnership(recurrence.sender, userId, next)) {
        let result = await collections.recurrence.updateOne({_id: new ObjectId(recurrenceId)}, {$set: {creationDate: creationDate}});
        if (result.modifiedCount !== 1) {
          return next(new HttpException('Recurrence update failed', 500));
        } else {
          return true;
        }
      } else {
        return next(new HttpException('Recurrence update is unauthorized', 401));
      }
    }
  }

  async updateRecurrenceOccurrence(userId: ObjectId, recurrenceId: ObjectId, occurrence: string, next: NextFunction) {
    let recurrence = await collections.recurrence.findOne({_id: new ObjectId(recurrenceId)});
    if (!recurrence) {
      return next(new HttpException('Recurrence does not exist', 404));
    } else {
      if (!this.checkRecurrenceOwnership(recurrence.sender, userId, next)) {
        let result = await collections.recurrence.updateOne({_id: new ObjectId(recurrenceId)}, {$set: {occurrence: occurrence}});
        if (result.modifiedCount !== 1) {
          return next(new HttpException('Recurrence update failed', 500));
        } else {
          return true;
        }
      } else {
        return next(new HttpException('Recurrence update is unauthorized', 401));
      }
    }
  }

  async updateRecurrenceCategory(userId: ObjectId, recurrenceId: ObjectId, category: string, next: NextFunction) {
    let recurrence = await collections.recurrence.findOne({_id: new ObjectId(recurrenceId)});
    if (!recurrence) {
      return next(new HttpException('Recurrence does not exist', 404));
    } else {
      if (!this.checkRecurrenceOwnership(recurrence.sender, userId, next)) {
        let result = await collections.recurrence.updateOne({_id: new ObjectId(recurrenceId)}, {$set: {category: category}});
        if (result.modifiedCount !== 1) {
          return next(new HttpException('Recurrence update failed', 500));
        } else {
          return true;
        }
      } else {
        return next(new HttpException('Recurrence update is unauthorized', 401));
      }
    }
  }

  async updateRecurrenceReceiver(userId: ObjectId, recurrenceId: ObjectId, receiver: Receiver, next: NextFunction) {
    let recurrence = await collections.recurrence.findOne({_id: new ObjectId(recurrenceId)});
    if (!recurrence) {
      return next(new HttpException('Recurrence does not exist', 404));
    } else {
      if (!this.checkRecurrenceOwnership(recurrence.sender, userId, next)) {
        let result = await collections.recurrence.updateOne({_id: new ObjectId(recurrenceId)}, {$set: {receiver: receiver}});
        if (result.modifiedCount !== 1) {
          return next(new HttpException('Recurrence update failed', 500));
        } else {
          return true;
        }
      } else {
        return next(new HttpException('Recurrence update is unauthorized', 401));
      }
    }
  }

  async updateRecurrenceAmount(userId: ObjectId, recurrenceId: ObjectId, amount: number, next: NextFunction) {
    let recurrence = await collections.recurrence.findOne({_id: new ObjectId(recurrenceId)});
    if (!recurrence) {
      return next(new HttpException('Recurrence does not exist', 404));
    } else {
      if (!this.checkRecurrenceOwnership(recurrence.sender, userId, next)) {
        let result = await collections.recurrence.updateOne({_id: new ObjectId(recurrenceId)}, {$set: {amount: amount}});
        if (result.modifiedCount !== 1) {
          return next(new HttpException('Recurrence update failed', 500));
        } else {
          return true;
        }
      } else {
        return next(new HttpException('Recurrence update is unauthorized', 401));
      }
    }
  }

  async removeRecurrence(recurrenceId: ObjectId, userId: ObjectId, next: NextFunction) {
    let recurrence = await collections.recurrence.findOne({_id: new ObjectId(recurrenceId)});
    if (this.checkRecurrenceOwnership(recurrence.sender, userId, next)) {
      let deleteQuery = await collections.recurrence.deleteOne({_id: new ObjectId(recurrenceId)});
      if (!deleteQuery.acknowledged) {
        return next(new HttpException('Recurrence removal failed', 500));
      } else {
        return true;
      }
    } else {
      return next(new HttpException('Recurrence removal is unauthorized', 401));
    }
  }

  checkRecurrenceAffiliation(recurrence: Recurrence, userAccounts: AccountObject[], next: NextFunction) {
    for (let userAccount of userAccounts) {
      if ((userAccount.accountId === recurrence.sender.senderAccount) ||
        (userAccount.accountId === recurrence.receiver.receiverAccount)) {
        return true;
      }
    }
    return next(new HttpException('Recurrence access violation', 401));
  }

  checkRecurrenceOwnership(sender: Sender, userId: ObjectId, next: NextFunction) {
    if (sender.senderId !== userId) return next(new HttpException('Recurrence request is unauthorized', 401));
    return true;
  }
}