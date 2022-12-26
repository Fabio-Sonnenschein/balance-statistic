import express from 'express';
import { connectToDatabase } from './services/database.service'
import { serviceMiddleware } from './middlewares/service.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import cors from 'cors';
import dotenv from 'dotenv';
import {userRouter} from './routes/user.route';
import {budgetRouter} from "./routes/budget.route";
import {accountRouter} from "./routes/account.route";
import {savingGoalRouter} from "./routes/savinggoal.route";
import {transactionRouter} from "./routes/transaction.route";
import {authRouter} from "./routes/auth.route";

const app: express.Application = express();

dotenv.config();

console.log('\n[ *   ] [ *   ] -----------------------------');
console.log('[  *  ] [  *  ]');
console.log('[   * ] [   * ]   balance statistic - ' + process.env.npm_package_version);
console.log('[  *  ] [  *  ]');
console.log('[ *   ] [ *   ] -----------------------------\n');

connectToDatabase()
    .then(() => {
        app.use(cors());
        app.use(express.json());
        app.use(serviceMiddleware);
        app.use('/auth', authRouter);
        app.use('/user', userRouter);
        app.use('/account', accountRouter);
        app.use('/budget', budgetRouter);
        app.use('/savingGoal', savingGoalRouter);
        app.use('/transaction', transactionRouter);

        app.use(errorMiddleware);

        app.listen(process.env.SERVER_PORT, () => {
            console.log('[ *** ] [ SRV ] Server located in directory');
            console.log('[     ] [ SRV ]     ' + __dirname);
            console.log('[ *** ] [ SRV ] Server listening on port');
            console.log('[     ] [ SRV ]     ' + process.env.SERVER_PORT);
            console.log('[ *** ] [ SRV ] Server started');
            console.log('[     ] [ SRV ]     successfully.');
        });
    })
    .catch((error: Error) => {
        console.error('[#ERR#] [ DB  ] Database connection failed! Error:');
        console.error('[#   #] [ DB  ]     ' + error);
        process.exit();
    });