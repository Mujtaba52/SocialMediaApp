import joi from 'joi'
import { Request, Response } from 'express'
import { IUser, role } from '../models/user'

const userSignup = joi.object<IUser>({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
  userRole: joi.string().valid(role.MEMBER, role.MODERATOR, role.PREMIUM)
})

const userSignin = joi.object<IUser>({
  email: joi.string().email().required(),
  password: joi.string().min(3).required()
})

const SignUpValidator = (req: Request, res: Response, next: any) => {
  const { error } = userSignup.validate(req.body, { abortEarly: false })
  if (error) return res.status(401).send(error.details)
  next()
}

const SignInValidator = (req: Request, res: Response, next: any) => {
  const { error } = userSignin.validate(req.body, { abortEarly: false })
  if (error) return res.status(401).send(error.details)
  next()
}

export {
  SignUpValidator,
  SignInValidator
}
