import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongodb: MongoMemoryServer = new MongoMemoryServer()

const connectDB = async (): Promise<void> => {
  mongodb = await MongoMemoryServer.create()
  const uri = mongodb.getUri()
  await mongoose.connect(uri)
}
const dropDB = async (): Promise<void> => {
  try {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongodb.stop()
  } catch (err) {
    console.log(err)
  }
}
const dropCollections = async (): Promise<void> => {
  try {
    const collections = mongoose.connection.db.collections()

    await Promise.all(
      Object.values(collections).map(async (collection) => {
        await collection.deleteMany()
      })
    )
  } catch (err) {
    console.log(err)
  }
}

export { connectDB, dropDB, dropCollections }
