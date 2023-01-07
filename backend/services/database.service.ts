import {
  MongoClient,
  Db,
  Collection
} from 'mongodb';
import * as dotenv from 'dotenv';

let client: MongoClient;
export const collections: {
  account?: Collection,
  user?: Collection,
  savingGoal?: Collection,
  transaction?: Collection,
  recurrence?: Collection
} = {};

export async function connectToDatabase() {
  dotenv.config();
  client = new MongoClient(process.env.DB_CONNECTION_STRING);

  await client.connect();
  const db: Db = client.db(process.env.DB_NAME);

  const accountCollection: Collection = db.collection(process.env.ACCOUNT_COLLECTION_NAME);
  const userCollection: Collection = db.collection(process.env.USER_COLLECTION_NAME);
  const savingGoalCollection: Collection = db.collection(process.env.SAVING_GOAL_COLLECTION_NAME);
  const transactionCollection: Collection = db.collection(process.env.TRANSACTION_COLLECTION_NAME);
  const recurrenceCollection: Collection = db.collection(process.env.RECURRENCE_COLLECTION_NAME);

  collections.account = accountCollection;
  collections.user = userCollection;
  collections.savingGoal = savingGoalCollection;
  collections.transaction = transactionCollection;
  collections.recurrence = recurrenceCollection;

  console.log('[ *** ] [ DB  ] Connected to DB');
  console.log('[     ] [ DB  ]     ' + db.databaseName);
  console.log('[     ] [ DB  ]');
  console.log('[ *** ] [ DB  ] Connected to Collections');
  console.log('[     ] [ DB  ]     ' + accountCollection.collectionName);
  console.log('[     ] [ DB  ]     ' + userCollection.collectionName);
  console.log('[     ] [ DB  ]     ' + savingGoalCollection.collectionName);
  console.log('[     ] [ DB  ]     ' + transactionCollection.collectionName);
  console.log('[     ] [ DB  ]     ' + recurrenceCollection.collectionName);
  console.log('[     ] [ DB  ]');
  console.log('[ *** ] [ DB  ] Database connection established.');
  console.log('[     ] [     ]');
}

export function disconnectDatabase() {
  console.log('[ --- ] [ DB  ] Closing DB connection');
  client.close().then().catch((error: Error) => {
    console.error('[#ERR#] [ DB  ] Closing DB connection failed!');
    console.error('[#ERR#] [ DB  ]     Error:');
    console.error('[#   #] [ DB  ]     ' + error);
    console.error('[#   #] [ DB  ]');
    console.error('[#####] [ DB  ] Database error report concluded.');
    console.error('[     ] [     ]');
  });
  console.log('[ --- ] [ DB  ] DB connection closed.');
}
