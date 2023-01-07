import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express';
import {HttpException} from '../exceptions/http.exception';
import {User} from '../models/user';
import {plainToInstance} from 'class-transformer';
import {ObjectId} from 'mongodb';
import {Transaction} from '../models/transaction';
import {TransactionStatus} from '../models/transaction-status';

export const transactionRouter: Router = Router();

transactionRouter.get('/:transactionId/:userToken', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.transactionId ||
    !req.params.userToken) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.params.userToken, req)
    .catch((error: Error) => {
      next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let transactionId: ObjectId = plainToInstance(ObjectId, req.params.transactionId);
  let transaction: Transaction = await req.services.transactionService.getTransactionById(new ObjectId(transactionId))
    .catch((error: Error) => {
      return next(error);
    });
  if (!transaction) return next(new HttpException('Transaction retrieval failed', 500));

  if (!req.services.transactionService.checkTransactionAffiliation(transaction, user._id)) {
    return next(new HttpException('Transaction access violation', 401));
  }
  res.status(200).json(transaction);
});

transactionRouter.get('/user/:userToken', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.userToken) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.params.userToken, req)
    .catch((error: Error) => {
      throw error;
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let count: number = parseInt(process.env.STANDARD_TRANSACTION_COUNT);
  if (req.query.c) {
    count = parseInt(<string>req.query.c);
  }

  let offset: number = 0;
  if (req.query.o) {
    offset = parseInt(<string>req.query.o);
  }

  let transactions = await req.services.transactionService.getTransactionsByUser(user._id, count, offset)
    .catch((error: Error) => {
      return next(error);
    });
  if (!transactions) return next(new HttpException('Transaction retrieval failed', 500));
  res.status(200).json(transactions);
});

transactionRouter.post('', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.transaction.amount ||
    !req.body.transaction.type ||
    !req.body.transaction.timestamp ||
    !req.body.transaction.description ||
    !req.body.transaction.sender.senderId ||
    !req.body.transaction.sender.senderAccount ||
    !req.body.transaction.receiver.receiverId ||
    !req.body.transaction.receiver.receiverAccount) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let transaction: Transaction = plainToInstance(Transaction, req.body.transaction);
  transaction.owner = user._id;
  transaction.status = TransactionStatus.REGISTERED;

  let transactionId = await req.services.transactionService.insertTransaction(user._id, transaction)
    .catch((error: Error) => {
      return next(error);
    });
  if (!transactionId) return next(new HttpException('Transaction insertion failed', 500));
  res.status(200).json(transactionId);
});

transactionRouter.put('/category', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.transaction._id ||
    !req.body.transaction.category) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.transactionService.updateTransactionCategory(user._id, req.body.transaction._id, req.body.transaction.category)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Transaction update failed', 500));
  res.status(200).json(true);
});

transactionRouter.put('/description', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.transaction._id ||
    !req.body.transaction.description) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let update = await req.services.transactionService.updateTransactionDescription(user._id, req.body.transaction._id, req.body.transaction.description)
    .catch((error: Error) => {
      return next(error);
    });
  if (!update) return next(new HttpException('Transaction update failed', 500));
  res.status(200).json(true);
});

transactionRouter.delete('', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.transaction._id) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req)
    .catch((error: Error) => {
      return next(error);
    });
  if (!user) return next(new HttpException('Request unauthorized', 401));

  let deleteQuery = await req.services.transactionService.removeTransaction(user._id, req.body.transaction._id)
    .catch((error: Error) => {
      return next(error);
    });
  if (!deleteQuery) return next(new HttpException('Transaction removal failed', 500));
  res.status(200).json(true);
});
