import {collections} from './database.service';
import {ObjectId} from 'mongodb';
import {SavingGoal} from '../models/savingGoal';
import {HttpException} from '../exceptions/http.exception';

export class SavingGoalService {
  async insertSavingGoal(savingGoal: SavingGoal) {
    let insertQuery = await collections.savingGoal.insertOne(savingGoal);
    if (!insertQuery.acknowledged) throw new HttpException('Saving Goal insertion failed', 500);
    return insertQuery.insertedId;
  }

  async getSavingGoals(userId: ObjectId) {
    return collections.user.aggregate<SavingGoal[]>([
      {
        '$match': {
          '_id': new ObjectId(userId)
        }
      }, {
        '$project': {
          '_id': 0,
          'savingGoals': 1
        }
      }, {
        '$lookup': {
          'from': 'savingGoal',
          'localField': 'savingGoals',
          'foreignField': '_id',
          'as': 'temp'
        }
      }, {
        '$project': {
          'savingGoals': {
            '$map': {
              'input': '$temp',
              'in': {
                '$let': {
                  'vars': {
                    'i': {
                      '$arrayElemAt': [
                        {
                          '$filter': {
                            'input': '$savingGoals',
                            'cond': {
                              '$eq': [
                                '$$savingGoal._id', '$$this._id'
                              ]
                            },
                            'as': 'savingGoal'
                          }
                        }, 0
                      ]
                    }
                  },
                  'in': {
                    '$mergeObjects': [
                      '$$this'
                    ]
                  }
                }
              }
            }
          }
        }
      }, {
        '$unwind': {
          'path': '$savingGoals',
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$replaceRoot': {
          'newRoot': '$savingGoals'
        }
      }
    ]).toArray()
      .catch((error: Error) => {
        throw error;
      });
  }

  async getSavingGoalById(savingGoalId: ObjectId) {
    let savingGoal = await collections.savingGoal.findOne<SavingGoal>({
      _id: new ObjectId(savingGoalId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!savingGoalId) throw new HttpException('No saving goal found', 404);
    return savingGoal;
  }

  async updateSavingGoalName(userId: ObjectId, savingGoalId: ObjectId, name: string) {
    let updateQuery = await collections.savingGoal.updateOne({
      _id: new ObjectId(savingGoalId)
    }, {
      $set: {
        name: name
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Saving goal update failed', 500);
    return true;
  }

  async updateSavingGoalDescription(userId: ObjectId, savingGoalId: ObjectId, description: string) {
    let updateQuery = await collections.savingGoal.updateOne({
      _id: new ObjectId(savingGoalId)
    }, {
      $set: {
        description: description
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Saving goal update failed', 500);
    return true;
  }

  async updateSavingGoalTotal(userId: ObjectId, savingGoalId: ObjectId, total: number) {
    let updateQuery = await collections.savingGoal.updateOne({
      _id: new ObjectId(savingGoalId)
    }, {
      $set: {
        total: total
      }
    });
    if (!updateQuery.acknowledged) throw new HttpException('Saving goal update failed', 500);
    return true;
  }

  async updateSavingGoalCurrent(userId: ObjectId, savingGoalId: ObjectId, current: number) {
    let updateQuery = await collections.savingGoal.updateOne({
      _id: new ObjectId(savingGoalId)
    }, {
      $set: {
        current: current
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Saving goal update failed', 500);
    return true;
  }

  async updateSavingGoalStartDate(userId: ObjectId, savingGoalId: ObjectId, startDate: Date) {
    let updateQuery = await collections.savingGoal.updateOne({
      _id: new ObjectId(savingGoalId)
    }, {
      $set: {
        startDate: startDate
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Saving goal update failed', 500);
    return true;
  }

  async updateSavingGoalEndDate(userId: ObjectId, savingGoalId: ObjectId, endDate: Date) {
    let updateQuery = await collections.savingGoal.updateOne({
      _id: new ObjectId(savingGoalId)
    }, {
      $set: {
        endDate: endDate
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Saving goal update failed', 500);
    return true;
  }

  async updateSavingGoalCategory(userId: ObjectId, savingGoalId: ObjectId, category: string) {
    let updateQuery = await collections.savingGoal.updateOne({
      _id: new ObjectId(savingGoalId)
    }, {
      $set: {
        category: category
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Saving goal update failed', 500);
    return true;
  }

  async updateSavingGoalAccount(userId: ObjectId, savingGoalId: ObjectId, account: string) {
    // TODO: Transfer current amount from previous to new account
  }

  async updateSavingGoalContributorRate(userId: ObjectId,
                                        savingGoalId: ObjectId,
                                        contributorId: ObjectId,
                                        rate: number) {
    // TODO: Definitely check for issues with this query!!
    let updateQuery = await collections.savingGoal.updateOne({
      $and: {
        _id: new ObjectId(savingGoalId),
        'access.contributors.userId': new ObjectId(contributorId)
      }
    }, {
      $set: {
        'access.contributors.rate': rate
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Saving goal update failed', 500);
    return true;
  }

  async updateSavingGoalContributorAdd(userId: ObjectId,
                                       savingGoalId: ObjectId,
                                       contributorId: ObjectId,
                                       rate: number) {
    let savingGoal = await collections.savingGoal.findOne<SavingGoal>({
      _id: new ObjectId(savingGoalId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!savingGoal) throw new HttpException('Saving goal does not exist', 404);

    if (!this.checkSavingGoalOwnership(savingGoal, userId)) {
      throw new HttpException('Saving goal request is unauthorized', 401);
    }

    // TODO: Definitely check for issues with this query!!
    let updateQuery = await collections.savingGoal.updateOne({
      _id: new ObjectId(savingGoalId)
    }, {
      'access.contributors': {
        $push: {
          userId: new ObjectId(contributorId),
          rate: rate
        }
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Saving goal update failed', 500);
    return true;
  }

  async updateSavingGoalContributorRemove(userId: ObjectId, savingGoalId: ObjectId, contributorId: ObjectId) {
    let savingGoal = await collections.savingGoal.findOne<SavingGoal>({
      _id: new ObjectId(savingGoalId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!savingGoal) throw new HttpException('Saving goal does not exist', 404);

    if (!this.checkSavingGoalOwnership(savingGoal, userId)) {
      throw new HttpException('Saving goal request is unauthorized', 401);
    }

    // TODO: Definitely check for issues with this query!!
    let updateQuery = await collections.savingGoal.updateOne({
      $and: {
        _id: new ObjectId(savingGoalId),
        'access.contributors.userId': new ObjectId(contributorId)
      }
    }, {
      'access.contributors': {
        $pull: {
          userId: new ObjectId(contributorId)
        }
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Saving goal update failed', 500);
    return true;
  }

  async updateSavingGoalOwner(userId: ObjectId, savingGoalId: ObjectId, newOwnerId: ObjectId) {
    // TODO: Linked account needs to change as well
  }

  async removeSavingGoal(userId: ObjectId, savingGoalId: ObjectId) {
    let savingGoal = await collections.savingGoal.findOne<SavingGoal>({
      _id: new ObjectId(savingGoalId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!savingGoal) throw new HttpException('Saving goal does not exist', 404);

    if (this.checkSavingGoalOwnership(savingGoal, userId)) {
      throw new HttpException('Saving goal removal is unauthorized', 401);
    }

    let deleteQuery = await collections.savingGoal.deleteOne({
      _id: new ObjectId(savingGoalId)
    }).catch((error: Error) => {
      throw error;
    });
    if (!deleteQuery.acknowledged) throw new HttpException('Saving goal removal failed', 500);
    return true;
  }

  checkSavingGoalAffiliation(savingGoal: SavingGoal, userId: ObjectId) {
    if (this.checkSavingGoalOwnership(savingGoal, userId)) return true;
    for (let contributor of savingGoal.access.contributors) {
      if (contributor.userId === userId) {
        return true;
      }
    }
    throw new HttpException('Saving goal request is unauthorized', 401);
  }

  checkSavingGoalOwnership(savingGoal: SavingGoal, userId: ObjectId) {
    if (savingGoal.access.owner !== userId) throw new HttpException('Saving goal request is unauthorized', 401);
    return true;
  }
}
