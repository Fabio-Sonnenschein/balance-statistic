import {ObjectId} from "mongodb";
import {Budget} from "./budget";

export class User {
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;
    session?: Session;
    accounts?: AccountObject[];
    savingGoals?: ObjectId[];
    budget?: Budget;
}

class Session {
    token: string;
    expires: Date;
}

export class AccountObject {
    accountId: ObjectId;
    sumSelect: boolean;
}
