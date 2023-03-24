import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const MONGO_PATH: string = process.env.MONGO_PATH ?? ''

mongoose.set('strictQuery', false)

const startConnection = async (): Promise<void> => {
  await mongoose
    .connect(MONGO_PATH)
    .then((res) => {
      console.log('Connected to Database - Initial Connection')
    })
    .catch((err) => {
      console.log(
        `Initial Database Connection Failed - ${err.message as string}`
      )
    })
}

export default startConnection
