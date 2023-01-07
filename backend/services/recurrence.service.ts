import {Recurrence} from '../models/recurrence';
import {AccountObject} from '../models/user';
import {HttpException} from '../exceptions/http.exception';
import {ObjectId} from 'mongodb';
import {collections} from './database.service';
import {
  Receiver,
  Sender
} from '../models/transaction';

export class RecurrenceService {
  async insertRecurrence(recurrence: Recurrence) {
    let insertQuery = await collections.recurrence.insertOne(recurrence).catch((error: Error) => {
      throw error;
    });
    if (!insertQuery.acknowledged) throw new HttpException('Recurrence insertion failed', 500);
    return insertQuery.insertedId;
  }

  async getRecurrenceById(recurrenceId: ObjectId) {
    let recurrence = await collections.recurrence.findOne<Recurrence>({
      _id: new ObjectId(recurrenceId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!recurrence) throw new HttpException('No recurrence found', 404);
    return recurrence;
  }

  async updateRecurrenceName(userId: ObjectId, recurrenceId: ObjectId, name: string) {
    let recurrence = await collections.recurrence.findOne<Recurrence>({
      _id: new ObjectId(recurrenceId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!recurrence) throw new HttpException('Recurrence does not exist', 404);

    if (!this.checkRecurrenceOwnership(recurrence.sender, userId)) {
      throw new HttpException('Recurrence update is unauthorized', 401);
    }

    let updateQuery = await collections.recurrence.updateOne({
      _id: new ObjectId(recurrenceId)
    }, {
      $set: {
        name: name
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Recurrence update failed', 500);
    return true;
  }

  async updateRecurrenceDescription(userId: ObjectId, recurrenceId: ObjectId, description: string) {
    let recurrence = await collections.recurrence.findOne<Recurrence>({
      _id: new ObjectId(recurrenceId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!recurrence) throw new HttpException('Recurrence does not exist', 404);

    if (!this.checkRecurrenceOwnership(recurrence.sender, userId)) {
      throw new HttpException('Recurrence update is unauthorized', 401);
    }

    let updateQuery = await collections.recurrence.updateOne({
      _id: new ObjectId(recurrenceId)
    }, {
      $set: {
        description: description
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Recurrence update failed', 500);
    return true;
  }

  async updateRecurrenceCreationDate(userId: ObjectId, recurrenceId: ObjectId, creationDate: Date) {
    let recurrence = await collections.recurrence.findOne<Recurrence>({
      _id: new ObjectId(recurrenceId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!recurrence) throw new HttpException('Recurrence does not exist', 404);

    if (!this.checkRecurrenceOwnership(recurrence.sender, userId)) {
      throw new HttpException('Recurrence update is unauthorized', 401);
    }

    let updateQuery = await collections.recurrence.updateOne({
      _id: new ObjectId(recurrenceId)
    }, {
      $set: {
        creationDate: creationDate
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Recurrence update failed', 500);
    return true;
  }

  async updateRecurrenceOccurrence(userId: ObjectId, recurrenceId: ObjectId, occurrence: string) {
    let recurrence = await collections.recurrence.findOne<Recurrence>({
      _id: new ObjectId(recurrenceId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!recurrence) throw new HttpException('Recurrence does not exist', 404);

    if (!this.checkRecurrenceOwnership(recurrence.sender, userId)) {
      throw new HttpException('Recurrence update is unauthorized', 401);
    }

    let updateQuery = await collections.recurrence.updateOne({
      _id: new ObjectId(recurrenceId)
    }, {
      $set: {
        occurrence: occurrence
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Recurrence update failed', 500);
    return true;
  }

  async updateRecurrenceCategory(userId: ObjectId, recurrenceId: ObjectId, category: string) {
    let recurrence = await collections.recurrence.findOne<Recurrence>({
      _id: new ObjectId(recurrenceId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!recurrence) throw new HttpException('Recurrence does not exist', 404);

    if (!this.checkRecurrenceOwnership(recurrence.sender, userId)) {
      throw new HttpException('Recurrence update is unauthorized', 401);
    }

    let updateQuery = await collections.recurrence.updateOne({
      _id: new ObjectId(recurrenceId)
    }, {
      $set: {
        category: category
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Recurrence update failed', 500);
    return true;
  }

  async updateRecurrenceReceiver(userId: ObjectId, recurrenceId: ObjectId, receiver: Receiver) {
    let recurrence = await collections.recurrence.findOne<Recurrence>({
      _id: new ObjectId(recurrenceId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!recurrence) throw new HttpException('Recurrence does not exist', 404);

    if (!this.checkRecurrenceOwnership(recurrence.sender, userId)) {
      throw new HttpException('Recurrence update is unauthorized', 401);
    }

    let updateQuery = await collections.recurrence.updateOne({
      _id: new ObjectId(recurrenceId)
    }, {
      $set: {
        receiver: receiver
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Recurrence update failed', 500);
    return true;
  }

  async updateRecurrenceAmount(userId: ObjectId, recurrenceId: ObjectId, amount: number) {
    let recurrence = await collections.recurrence.findOne<Recurrence>({
      _id: new ObjectId(recurrenceId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!recurrence) throw new HttpException('Recurrence does not exist', 404);

    if (!this.checkRecurrenceOwnership(recurrence.sender, userId)) {
      throw new HttpException('Recurrence update is unauthorized', 401);
    }

    let updateQuery = await collections.recurrence.updateOne({
      _id: new ObjectId(recurrenceId)
    }, {
      $set: {
        amount: amount
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Recurrence update failed', 500);
    return true;
  }

  async removeRecurrence(recurrenceId: ObjectId, userId: ObjectId) {
    let recurrence = await collections.recurrence.findOne<Recurrence>({
      _id: new ObjectId(recurrenceId)
    }).catch((error: Error) => {
      throw error;
    });

    if (!this.checkRecurrenceOwnership(recurrence.sender, userId)) {
      throw new HttpException('Recurrence removal is unauthorized', 401);
    }

    let deleteQuery = await collections.recurrence.deleteOne({
      _id: new ObjectId(recurrenceId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!deleteQuery.acknowledged) throw new HttpException('Recurrence removal failed', 500);
    return true;
  }

  checkRecurrenceAffiliation(recurrence: Recurrence, userAccounts: AccountObject[]) {
    for (let userAccount of userAccounts) {
      if ((userAccount.accountId === recurrence.sender.senderAccount) ||
        (userAccount.accountId === recurrence.receiver.receiverAccount)) {
        return true;
      }
    }
    throw new HttpException('Recurrence access violation', 401);
  }

  checkRecurrenceOwnership(sender: Sender, userId: ObjectId) {
    if (sender.senderId !== userId) {
      throw new HttpException('Recurrence request is unauthorized', 401);
    }
    return true;
  }
}
