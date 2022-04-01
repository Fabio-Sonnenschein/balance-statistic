import express from 'express';
import { connectToDatabase } from './services/database.service'
import { serviceMiddleware } from './middlewares/service.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.route';
import { loginRouter } from './routes/login.route';
import { registerRouter } from './routes/register.route';

const app: express.Application = express();

dotenv.config();

console.log('\n[ *   ] [ *   ] -------------------------');
console.log('[  *  ] [  *  ]');
console.log('[   * ] [   * ]     balance statistic');
console.log('[  *  ] [  *  ]');
console.log('[ *   ] [ *   ] -------------------------\n');

connectToDatabase()
    .then(() => {
        app.use(cors());
        app.use(express.json());
        app.use(serviceMiddleware);
        app.use('/user', userRouter);
        app.use('/login', loginRouter);
        app.use('/register', registerRouter);

        app.use(errorMiddleware);

        app.listen(process.env.SERVER_PORT, () => {
            console.log('[ *** ] [ SRV ] Server listening on Port');
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