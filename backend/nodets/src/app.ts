import * as dotenv from 'dotenv'
import express from 'express'
import { fileURLToPath } from 'url'
import { type Request, type Response, type NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import logger from 'morgan'
import { startConnection } from './db/mongodb.js'
import issuesRouter from './routes/issuesRoute.js'
import projectsRouter from './routes/projectsRoute.js'
import indexRouter from './routes/indexRoute.js'
import usersRouter from './routes/usersRoute.js'
import { connectDB, loadDevData } from './db/testdb.js'
import messagesRouter from './routes/messagesRoute.js'
import tagsRouter from './routes/tagsRoute.js'
import authRouter from './routes/authRoute.js'

interface Error {
  status?: number
  message?: string
}

// eslint-disable-next-line no-underscore-dangle
const _dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  path: path.resolve(_dirname, `../.env.${process.env.NODE_ENV}`)
})

const PORT = process.env.PORT ?? '3000'

const app = express()

// Select which database to connect to
if (process.env.NODE_ENV !== 'development') {
  console.log('Starting connection.. ')
  void startConnection()
} else {
  connectDB()
    .then(() => {
      console.log('Connected to development database')
    })
    .then(async () => {
      await loadDevData()
    })
    .catch((err) => {
      console.log(err)
    })
}

app.use(cookieParser())

app.use(
  cors({
    origin: ['http://127.0.0.1:5173'],
    credentials: true
  })
)

// set up logging
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'))
} else {
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
  )
  app.use(logger('combined', { stream: accessLogStream }))
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(_dirname, 'public')))

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Content-Type', 'application/json')
  next()
})

app.use(indexRouter)
app.use(authRouter)
app.use('/issues', issuesRouter)
app.use('/projects', projectsRouter)
app.use(usersRouter)
app.use(messagesRouter)
app.use(tagsRouter)
// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const errorStatus = err.status ?? 500
  res.status(errorStatus).json(err)
  console.log(err.message)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
