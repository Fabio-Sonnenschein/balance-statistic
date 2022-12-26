import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express';
import {HttpException} from '../exceptions/http.exception';
import {Recurrence} from '../models/recurrence';
import {User} from '../models/user';
import {ObjectId} from 'mongodb';
import {plainToInstance} from 'class-transformer';
import {Receiver} from '../models/transaction';

export const recurrenceRouter: Router = Router();

recurrenceRouter.get('/:recurrenceId/:userToken', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.recurrenceId ||
    !req.params.userToken) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.params.userToken, req, next);
  if (!user) return;

  let recurrenceId: ObjectId = plainToInstance(ObjectId, req.params.recurrenceId);
  let recurrence: Recurrence = await req.services.recurrenceService.getRecurrenceById(new ObjectId(recurrenceId), next).catch((error: Error) => {
    return next(error);
  });
  if (!recurrence) return;
  if (req.services.recurrenceService.checkRecurrenceAffiliation(recurrence, user.accounts, next)) {
    res.status(200).json(recurrence);
  }
});

recurrenceRouter.post('', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.recurrence.name ||
    !req.body.recurrence.creationDate ||
    !req.body.recurrence.occurrence ||
    !req.body.recurrence.sender.senderAccount ||
    !req.body.recurrence.receiver.receiverId ||
    !req.body.recurrence.receiver.receiverAccount ||
    !req.body.recurrence.amount) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req, next).catch((error: Error) => {
    return next(error);
  });
  if (!user) return;

  let recurrence: Recurrence = plainToInstance(Recurrence, req.body.recurrence);
  recurrence.sender.senderId = user._id;

  let recurrenceId = await req.services.recurrenceService.insertRecurrence(recurrence, next).catch((error: Error) => {
    return next(error);
  });
  if (!recurrenceId) return;
  res.status(200).json(recurrenceId);
});

recurrenceRouter.put('/name', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.recurrence._id ||
    !req.body.recurrence.name) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req, next).catch((error: Error) => {
    return next(error);
  });
  if (!user) return;

  if (!await req.services.recurrenceService.updateRecurrenceName(user._id, req.body.recurrence._id, req.body.recurrence.name, next).catch((error: Error) => {
    return next(error);
  })) return;
  res.status(200).json(true);
});

recurrenceRouter.put('/description', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.recurrence._id ||
    !req.body.recurrence.description) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authServices.authToken(req.body.token, req, next).catch((error: Error) => {
    return next(error);
  });
  if (!user) return;

  if (!await req.services.recurrenceServices.updateRecurrenceDescription(user._id, req.body.recurrence._id, req.body.recurrence.name, next).catch((error: Error) => {
    return next(error);
  })) return;
  res.status(200).json(true);
});

recurrenceRouter.put('/creationDate', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.recurrence._id ||
    !req.body.recurrence.creationDate) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req, next).catch((error: Error) => {
    return next(error);
  });
  if (!user) return;

  if (!await req.services.recurrenceService.updateRecurrenceCreationDate(user._id, req.body.recurrence._id, req.body.recurrence.name, next).catch((error: Error) => {
    return next(error);
  })) return;
  res.status(200).json(true);
});

recurrenceRouter.put('/occurrence', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.recurrence._id ||
    !req.body.recurrence.occurrence) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authServices.authToken(req.body.token, req, next).catch((error: Error) => {
    return next(error);
  });
  if (!user) return;

  if (!await req.services.recurrenceService.updateRecurrenceOccurrence(user._id, req.body.recurrence._id, req.body.recurrence.occurrence, next).catch((error: Error) => {
    return next(error);
  })) return;
  res.status(200).json(true);
});

recurrenceRouter.put('/category', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.recurrence._id ||
    !req.body.recurrence.category) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req, next).catch((error: Error) => {
    return next(error);
  });
  if (!user) return;

  if (!await req.services.recurrenceService.updateRecurrenceCategory(user._id, req.body.recurrence._id, req.body.recurrence.category, next).catch((error: Error) => {
    return next(error);
  })) return;
  res.status(200).json(true);
});

recurrenceRouter.put('/receiver', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.recurrence._id ||
    !req.body.recurrence.receiver.receiverAccount ||
    !req.body.recurrence.receiver.receiverId) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req, next).catch((error: Error) => {
    return next(error);
  });
  if (!user) return;

  let receiver: Receiver = plainToInstance(Receiver, req.body.recurrence.receiver);

  if (!await req.services.recurrenceService.updateRecurrenceReceiver(user._id, req.body.recurrence._id, receiver, next).catch((error: Error) => {
    return next(error);
  })) return;
  res.status(200).json(true);
});

recurrenceRouter.put('/amount', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.recurrence._id ||
    !req.body.recurrence.amount) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req, next).catch((error: Error) => {
    return next(error);
  });
  if (!user) return;

  if (!await req.services.recurrenceService.updateRecurrenceAmount(user._id, req.body.recurrence._id, req.body.recurrence.amount, next).catch((error: Error) => {
    return next(error);
  })) return;
  res.status(200).json(true);
});

recurrenceRouter.delete('', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token ||
    !req.body.recurrence._id) {
    return next(new HttpException('Bad request', 400));
  }

  let user: User = await req.services.authService.authToken(req.body.token, req, next).catch((error: Error) => {
    return next(error);
  });
  if (!user) return;

  if (!await req.services.recurrenceService.removeRecurrence(user._id, req.body.account._id, next).catch((error: Error) => {
    return next(error);
  })) return;
  res.status(200).json(true);
});
