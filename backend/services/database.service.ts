import { MongoClient, Db, Collection } from 'mongodb';
import * as dotenv from 'dotenv';

export const collections: {user?: Collection, transaction?: Collection} = {};

export async function connectToDatabase(){
    dotenv.config();
    const client: MongoClient = new MongoClient(process.env.DB_CONNECTION_STRING);

    await client.connect();
    const db: Db = client.db(process.env.DB_NAME);

    const userCollection: Collection = db.collection(process.env.USER_COLLECTION_NAME);
    const transactionCollection: Collection = db.collection(process.env.TRANSACTION_COLLECTION_NAME);

    collections.user = userCollection;
    collections.transaction = transactionCollection;

    console.log('[ *** ] [ DB  ] Connected to DB');
    console.log('[     ] [ DB  ]     ' + db.databaseName);
    console.log('[ *** ] [ DB  ] Connected to Collections');
    console.log('[     ] [ DB  ]     ' + userCollection.collectionName);
    console.log('[     ] [ DB  ]     ' + transactionCollection.collectionName);
}
