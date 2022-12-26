import {Budget} from "./budget";

export class User {
    _id?: string;
    name: string = '';
    email: string = '';
    password: string = '';
    session?: Session;
    accounts?: AccountObject[];
    savingGoals?: string[];
    budget?: Budget;
}

class Session {
    token?: string;
    expires?: Date;
}

class AccountObject {
    accountId: string = '';
    sumSelect: boolean = true;
}
