import {ObjectId} from "mongodb";

export class SavingGoal {
    _id?: ObjectId;
    name: string;
    description?: string;
    total: number;
    current: number;
    startDate: Date;
    endDate?: Date;
    category?: String;
    access: {
        owner: ObjectId,
        contributors: Contributor[]
    };
    account: ObjectId;
}

export class Contributor {
    userId: ObjectId;
    rate: number;
}