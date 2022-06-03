import {ObjectId} from "mongodb";
import {Budget} from "./budget";

export class User {
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;
    session?: Session;
    accounts?: ObjectId[];
    savingGoals?: ObjectId[];
    budget: Budget;
}

class Session {
    token: string;
    expires: Date;
}
