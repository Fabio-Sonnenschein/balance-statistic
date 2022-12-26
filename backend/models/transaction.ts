import {ObjectId} from 'mongodb';

export class Transaction {
  _id?: ObjectId;
  amount: number;
  type: string;
  category?: string;
  timestamp: Date;
  description: string;
  sender: Sender;
  receiver: Receiver;
  recurrenceId?: ObjectId;
  owner?: ObjectId;
  status?: string;
}

export class Sender {
  senderId: ObjectId;
  senderAccount: ObjectId;
}

export class Receiver {
  receiverId: ObjectId;
  receiverAccount?: ObjectId;
}