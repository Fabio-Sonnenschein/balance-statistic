import {ObjectId} from "mongodb";
import {Receiver, Sender} from "./transaction";

export class Recurrence {
    _id?: ObjectId;
    name: string;
    description?: string;
    creationDate: Date;
    occurrence: string;
    category?: string;
    sender: Sender;
    receiver: Receiver;
    amount: number;
}