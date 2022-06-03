import {ObjectId} from "mongodb";

export class Account {
    _id?: ObjectId;
    name: string;
    number: string;
    balance: number;
    provider: string;
    type: string;
}