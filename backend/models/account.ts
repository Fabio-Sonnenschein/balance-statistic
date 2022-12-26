import {ObjectId} from "mongodb";

export class Account {
    _id?: ObjectId;
    access: AccessPolicy;
    name: string;
    number: string;
    balance: number;
    currency: string;
    provider: string;
    type: string;
    selected: boolean;
}

export class AccessPolicy {
    owner: ObjectId;
    subscribers: ObjectId[];
}