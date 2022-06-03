import {ObjectId} from "mongodb";
import {Budget} from "../models/budget";
import {collections} from "./database.service";
import {HttpException} from "../exceptions/http.exception";

export class BudgetService {
    async updateBudget(userId: ObjectId, budget: Budget) {
        let updateQuery = await collections.user.updateOne({_id: userId}, {$set: {budget: budget}});
        if (!updateQuery.acknowledged) {
            throw new HttpException('Budget update failed', 500);
        } else {
            return true;
        }
    }
}