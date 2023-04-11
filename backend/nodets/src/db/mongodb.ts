import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import mongoose from 'mongoose'
import { connectDB } from './testdb.js'

// eslint-disable-next-line no-underscore-dangle
const _dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  path: path.resolve(_dirname, `../../.env.${process.env.NODE_ENV}`)
})

const MONGO_PATH: string = process.env.MONGO_PATH ?? ''

mongoose.set('strictQuery', false)

const startConnection = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'development') {
    await mongoose
      .connect(MONGO_PATH)
      .then(() => {
        console.log('Connected to Database - Initial Connection')
      })
      .catch((err) => {
        console.log(
          `Initial Database Connection Failed - ${err.message as string}`
        )
      })
  } else {
    await connectDB()
      .then(() => {
        console.log('Connected to Development Database - Intiial Connection')
      })
      .catch((err) => {
        console.log(
          `Initial Test Database Connection Failed - ${err.message as string}`
        )
      })
  }
}

const closeConnection = async (): Promise<void> => {
  await mongoose.connection.close()
}

export { startConnection, closeConnection }
