import {ObjectId} from "mongodb";
import {Budget} from "../models/budget";
import {collections} from "./database.service";
import {HttpException} from "../exceptions/http.exception";
import {NextFunction} from "express";

export class BudgetService {
    async insertBudget(userId: ObjectId, budget: Budget, next: NextFunction) {
        let updateQuery = await collections.user.updateOne({_id: new ObjectId(userId)}, {$set: {budget: budget}});
        if (!updateQuery.acknowledged) {
            return next(new HttpException('Budget update failed', 500));
        } else {
            return true;
        }
    }

    async updateBudgetSavingRate(userId: ObjectId, savingRate: number, next: NextFunction) {
        let result = await collections.user.updateOne({_id: new ObjectId(userId)}, {$set: {'budget.savingRate': savingRate}});
        if (result.modifiedCount !== 1) {
            return next(new HttpException('Budget update failed', 500));
        } else {
            return true;
        }
    }

    async updateBudgetBudget(userId: ObjectId, budget: number, next: NextFunction) {
        let result = await collections.user.updateOne({_id: new ObjectId(userId)}, {$set: {'budget.budget': budget}});
        if (result.modifiedCount !== 1) {
            return next(new HttpException('Budget update failed', 500));
        } else {
            return true;
        }
    }

    async updateBudgetEarnings(userId: ObjectId, earnings: number, next: NextFunction) {
        let result = await collections.user.updateOne({_id: new ObjectId(userId)}, {$set: {'budget.earnings': earnings}});
        if (result.modifiedCount !== 1) {
            return next(new HttpException('Budget update failed', 500));
        } else {
            return true;
        }
    }

    async updateBudgetExpenses(userId: ObjectId, expenses: number, next: NextFunction) {
        let result = await collections.user.updateOne({_id: new ObjectId(userId)}, {$set: {'budget.expenses': expenses}});
        if (result.modifiedCount !== 1) {
            return next(new HttpException('Budget update failed', 500));
        } else {
            return true;
        }
    }
}