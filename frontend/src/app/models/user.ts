import {Budget} from "./budget";

export class User {
    _id?: string;
    name: string = '';
    email: string = '';
    password: string = '';
    session?: Session;
    accounts?: string[];
    savingGoals?: string[];
    budget?: Budget;
}

class Session {
    token?: string;
    expires?: Date;
}
