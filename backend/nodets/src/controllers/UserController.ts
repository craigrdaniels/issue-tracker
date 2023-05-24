import type { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/userModel.js'
import type { IUser } from '../models/userModel.js'

// generate a copy of the user without a password
const generateSafeCopy = (user: IUser) => user.toJSON()

class UserController {
  static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user: IUser | null = await User.findOne({ _id: req.params.id })

    if (user === null || user === undefined) {
      throw new Error(`User with id ${req.params.id} not found`)
    }

    res.status(200).type('json').send(generateSafeCopy(user))
  }

  static getOneByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const email: string = req.params.email

    const user: IUser | null = await User.findOne({ email })

    if (user === null || user === undefined) {
      throw new Error(`User with email ${email} not found`)
    }

    res.status(200).type('json').send(generateSafeCopy(user))
  }

  static newUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { username, email, password } = req.body

    // create the user mode to init _id, created date etc.
    await User.init()

    const user = new User({
      username: username ?? email.split('@')[0],
      email,
      password: bcrypt.hashSync(password, 10)
    })

    const _user: IUser | null = await User.create(user)

    if (_user === null || _user === undefined) {
      throw new Error(`Unable to create user ${user.username} in db`)
    }

    res.status(201).type('json').send(_user)
  }

  static editUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const email: string = req.email

    const user: IUser | null = await User.findOneAndUpdate({ email }, req.body)

    // console.log(user?.username)
    if (user === null || user === undefined) {
      throw new Error(`Error finding / updating user with id ${email}`)
    }
    res.status(204).type('json').send(user)
  }
}

export default UserController

// TODO: check valid email address
// user roles / permissions to edit / change roles
//
