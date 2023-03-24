import * as dotenv from 'dotenv'
import express from 'express'
import { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import path from 'path'
import logger from 'morgan'
import startConnection from './db/mongodb.js'
import indexRouter from './routes/index.js'

interface Error {
  status?: number
  message?: string
}

dotenv.config()

const PORT = process.env.PORT ?? '3000'

const app = express()

void startConnection()

app.use(
  cors({
    origin: '*'
  })
)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-Width')
  res.header('Content-Type', 'application/json')
  next()
})

app.use('/', indexRouter)

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const errorStatus = err.status ?? 500
  res.status(errorStatus).json(err)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
