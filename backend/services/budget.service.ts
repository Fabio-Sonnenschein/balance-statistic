import {ObjectId} from 'mongodb';
import {Budget} from '../models/budget';
import {collections} from './database.service';
import {HttpException} from '../exceptions/http.exception';

export class BudgetService {
  async insertBudget(userId: ObjectId, budget: Budget) {
    let updateQuery = await collections.user.updateOne({
      _id: new ObjectId(userId)
    }, {
      $set: {
        budget: budget
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Budget update failed', 500);
    return true;
  }

  async updateBudgetSavingRate(userId: ObjectId, savingRate: number) {
    let updateQuery = await collections.user.updateOne({
      _id: new ObjectId(userId)
    }, {
      $set: {
        'budget.savingRate': savingRate
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Budget update failed', 500);
    return true;
  }

  async updateBudgetBudget(userId: ObjectId, budget: number) {
    let updateQuery = await collections.user.updateOne({
      _id: new ObjectId(userId)
    }, {
      $set: {
        'budget.budget': budget
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Budget update failed', 500);
    return true;
  }

  async updateBudgetEarnings(userId: ObjectId, earnings: number) {
    let updateQuery = await collections.user.updateOne({
      _id: new ObjectId(userId)
    }, {
      $set: {
        'budget.earnings': earnings
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Budget update failed', 500);
    return true;
  }

  async updateBudgetExpenses(userId: ObjectId, expenses: number) {
    let updateQuery = await collections.user.updateOne({
      _id: new ObjectId(userId)
    }, {
      $set: {
        'budget.expenses': expenses
      }
    }).catch((error: Error) => {
      throw error;
    });
    if (!updateQuery.acknowledged) throw new HttpException('Budget update failed', 500);
    return true;
  }
}
