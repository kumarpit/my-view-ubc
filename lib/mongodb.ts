import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI as string
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('Add Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
    let globalWithMongoClient = global as typeof globalThis & {
        _mongoClientPromise: Promise<MongoClient>;
      };
  if (!globalWithMongoClient._mongoClientPromise) {
    client = new MongoClient(uri, options as any)
    globalWithMongoClient._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongoClient._mongoClientPromise
} else {
  client = new MongoClient(uri, options as any)
  clientPromise = client.connect()
}

export default clientPromise as Promise<MongoClient>
