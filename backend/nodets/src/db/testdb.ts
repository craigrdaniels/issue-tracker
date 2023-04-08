import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongodb: MongoMemoryServer = new MongoMemoryServer()

const connectDB = async (): Promise<void> => {
  mongodb = await MongoMemoryServer.create()
  const uri = mongodb.getUri()
  await mongoose.connect(uri)
}
const dropDB = async (): Promise<void> => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongodb.stop()
}
const dropCollections = async (): Promise<void> => {
  const collections = await mongoose.connection.db.collections()
  // eslint-disable-next-line
  for (const collection of collections) {
    // eslint-disable-next-line
    await collection.drop()
  }
}

export { connectDB, dropDB, dropCollections }
