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
    await mongoose.connection.db.collections().then(async (cols) => {
      cols.map(
        async (
          col: mongoose.mongo.Collection<mongoose.mongo.BSON.Document>
        ) => {
          // console.log('Col: ', col.collectionName)
          await col.drop().catch((err) => {
            console.log(err)
          })
        }
      )
    })
  } catch (err) {
    console.log(err)
  }
}

export { connectDB, dropDB, dropCollections }
