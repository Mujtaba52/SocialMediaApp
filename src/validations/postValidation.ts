import joi from 'joi'
import { Request, Response } from 'express'
import { IPost } from '../models/post'

const createPost = joi.object<IPost>({
  description: joi.string().min(1).required()
})

const createPostValidator = (req: Request, res: Response, next: any) => {
  const { error } = createPost.validate(req.body)
  if (error) return res.status(401).send(error.details)
  next()
}

export { createPostValidator }
