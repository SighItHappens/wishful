import { MongoClient } from 'mongodb';

const uri: string | null = process.env.MONGODB_URI || "mongodb://localhost:27017";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise: Promise<MongoClient>
  }
  
  // In development, use a global variable to maintain the connection
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, create a new connection for each request
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
