import { MongoClient, Db, Collection } from 'mongodb';
import * as dotenv from 'dotenv';

export const collections: {users?: Collection, transactions?: Collection} = {};

export async function connectToDatabase(){
    dotenv.config();
    const client: MongoClient = new MongoClient(process.env.DB_CONNECTION_STRING);

    await client.connect();
    const db: Db = client.db(process.env.DB_NAME);

    const usersCollection: Collection = db.collection(process.env.USERS_COLLECTION_NAME);
    const transactionsCollection: Collection = db.collection(process.env.TRANSACTION_COLLECTION_NAME);

    collections.users = usersCollection;
    collections.transactions = transactionsCollection;

    console.log('[ *** ] [ DB  ] Connected to DB');
    console.log('[     ] [ DB  ]     ' + db.databaseName);
    console.log('[ *** ] [ DB  ] Connected to Collections');
    console.log('[     ] [ DB  ]     ' + usersCollection.collectionName);
    console.log('[     ] [ DB  ]     ' + transactionsCollection.collectionName);
}
