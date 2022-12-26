import {collections} from "./database.service";
import {ObjectId} from "mongodb";
import {NextFunction} from "express";
import {SavingGoal} from "../models/savingGoal";
import {HttpException} from "../exceptions/http.exception";

export class SavingGoalService {
    async insertSavingGoal(savingGoal: SavingGoal, next: NextFunction) {
        let insertQuery = await collections.savingGoal.insertOne(savingGoal);
        if (!insertQuery.acknowledged) {
            return next(new HttpException('Saving Goal insertion failed', 500));
        } else {
            return insertQuery.insertedId;
        }
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
    }

    async getSavingGoalById(savingGoalId: ObjectId, next: NextFunction) {
        let savingGoal = await collections.savingGoal.findOne<SavingGoal>({_id: new ObjectId(savingGoalId)});
        if (!savingGoalId) return next(new HttpException('No saving goal found', 404));
        return savingGoal;
    }

    async updateSavingGoalName(userId: ObjectId,
                               savingGoalId: ObjectId,
                               name: string,
                               next: NextFunction) {
        let result = await collections.savingGoal.updateOne({_id: new ObjectId(savingGoalId)}, {$set: {name: name}});
        if (result.modifiedCount !== 1) {
            return next(new HttpException('Saving goal update failed', 500));
        }

        return true;
    }

    async updateSavingGoalDescription(userId: ObjectId,
                                      savingGoalId: ObjectId,
                                      description: string,
                                      next: NextFunction) {
        let result = await collections.savingGoal.updateOne({_id: new ObjectId(savingGoalId)}, {$set: {description: description}});
        if (result.modifiedCount !== 1) {
            return next(new HttpException('Saving goal update failed', 500));
        }

        return true;
    }

    async updateSavingGoalTotal(userId: ObjectId,
                                savingGoalId: ObjectId,
                                total: number,
                                next: NextFunction) {
        let result = await collections.savingGoal.updateOne({_id: new ObjectId(savingGoalId)}, {$set: {total: total}});
        if (result.modifiedCount !== 1) {
            return next(new HttpException('Saving goal update failed', 500));
        }

        return true;
    }

    async updateSavingGoalCurrent(userId: ObjectId,
                                  savingGoalId: ObjectId,
                                  current: number,
                                  next: NextFunction) {
        let result = await collections.savingGoal.updateOne({_id: new ObjectId(savingGoalId)}, {$set: {current: current}});
        if (result.modifiedCount !== 1) {
            return next(new HttpException('Saving goal update failed', 500));
        }

        return true;
    }

    async updateSavingGoalStartDate(userId: ObjectId,
                                    savingGoalId: ObjectId,
                                    startDate: Date,
                                    next: NextFunction) {
        let result = await collections.savingGoal.updateOne({_id: new ObjectId(savingGoalId)}, {$set: {startDate: startDate}});
        if (result.modifiedCount !== 1) {
            return next(new HttpException('Saving goal update failed', 500));
        }

        return true;
    }

    async updateSavingGoalEndDate(userId: ObjectId,
                                  savingGoalId: ObjectId,
                                  endDate: Date,
                                  next: NextFunction) {
        let result = await collections.savingGoal.updateOne({_id: new ObjectId(savingGoalId)}, {$set: {endDate: endDate}});
        if (result.modifiedCount !== 1) {
            return next(new HttpException('Saving goal update failed', 500));
        }

        return true;
    }

    async updateSavingGoalCategory(userId: ObjectId,
                                   savingGoalId: ObjectId,
                                   category: string,
                                   next: NextFunction) {
        let result = await collections.savingGoal.updateOne({_id: new ObjectId(savingGoalId)}, {$set: {category: category}});
        if (result.modifiedCount !== 1) {
            return next(new HttpException('Saving goal update failed', 500));
        }

        return true;
    }

    async updateSavingGoalAccount(userId: ObjectId,
                                  savingGoalId: ObjectId,
                                  account: string,
                                  next: NextFunction) {
        // TODO: Transfer current amount from previous to new account
    }

    async updateSavingGoalContributorRate(userId: ObjectId,
                                          savingGoalId: ObjectId,
                                          contributorId: ObjectId,
                                          rate: number,
                                          next: NextFunction) {
        // TODO: Definitely check for issues with this query!!
        let result = await collections.savingGoal.updateOne({$and: {_id: new ObjectId(savingGoalId), 'access.contributors.userId': new ObjectId(contributorId)}}, {$set: {'access.contributors.rate': rate}});
        if (result.modifiedCount !== 1) {
            return next(new HttpException('Saving goal update failed', 500));
        }

        return true;
    }

    async updateSavingGoalContributorAdd(userId: ObjectId,
                                         savingGoalId: ObjectId,
                                         contributorId: ObjectId,
                                         rate: number,
                                         next: NextFunction) {
        let savingGoal = await collections.savingGoal.findOne<SavingGoal>({_id: new ObjectId(savingGoalId)});
        if (this.checkSavingGoalOwnership(savingGoal, userId, next)) {
            // TODO: Definitely check for issues with this query!!
            let result = await collections.savingGoal.updateOne({_id: new ObjectId(savingGoalId)}, {'access.contributors': {$push: {userId: new ObjectId(contributorId), rate: rate}}});
            if (result.modifiedCount !== 1) {
                return next(new HttpException('Saving goal update failed', 500));
            }

            return true;
        }
    }

    async updateSavingGoalContributorRemove(userId: ObjectId,
                                            savingGoalId: ObjectId,
                                            contributorId: ObjectId,
                                            next: NextFunction) {
        let savingGoal = await collections.savingGoal.findOne<SavingGoal>({_id: new ObjectId(savingGoalId)});
        if (this.checkSavingGoalOwnership(savingGoal, userId, next)) {
            // TODO: Definitely check for issues with this query!!
            let result = await collections.savingGoal.updateOne({$and: {_id: new ObjectId(savingGoalId), 'access.contributors.userId': new ObjectId(contributorId)}}, {'access.contributors': {$pull: {userId: new ObjectId(contributorId)}}});
            if (result.modifiedCount !== 1) {
                return next(new HttpException('Saving goal update failed', 500));
            }

            return true;
        }
    }

    async updateSavingGoalOwner(userId: ObjectId,
                                savingGoalId: ObjectId,
                                newOwnerId: ObjectId,
                                next: NextFunction) {
        // TODO: Linked account needs to change as well
    }

    async removeSavingGoal(userId: ObjectId, savingGoalId: ObjectId, next: NextFunction) {
        let savingGoal = await collections.savingGoal.findOne({_id: new ObjectId(savingGoalId)});
        if (savingGoal.access.owner === userId) {
            let deleteQuery = await collections.savingGoal.deleteOne({_id: new ObjectId(savingGoalId)});
            if (!deleteQuery.acknowledged) {
                return next(new HttpException('Saving goal removal failed', 500));
            } else {
                return true;
            }
        } else {
            return next(new HttpException('Saving goal removal is unauthorized', 401));
        }
    }

    checkSavingGoalAffiliation(savingGoal: SavingGoal, userId: ObjectId, next: NextFunction) {
        if (this.checkSavingGoalOwnership(savingGoal, userId, next)) return true;
        for (let contributor of savingGoal.access.contributors) {
            if (contributor.userId === userId) {
                return true;
            }
        }
        return next(new HttpException('Saving goal request is unauthorized', 401));
    }

    checkSavingGoalOwnership(savingGoal: SavingGoal, userId: ObjectId, next: NextFunction) {
        if (savingGoal.access.owner !== userId) return next(new HttpException('Saving goal request is unauthorized', 401));
        return true;
    }
}
