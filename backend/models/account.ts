import {ObjectId} from "mongodb";

export class Account {
    _id?: ObjectId;
    name: string;
    number: string;
    balance: number;
    currency: string;
    provider: string;
    type: string;
    selected: boolean;
}