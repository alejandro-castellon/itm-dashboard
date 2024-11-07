// utils/mongodb.ts
import { MongoClient } from "mongodb";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (!clientPromise) {
  client = new MongoClient(process.env.MONGODB_URI || "");
  clientPromise = client.connect();
}

export default clientPromise;
