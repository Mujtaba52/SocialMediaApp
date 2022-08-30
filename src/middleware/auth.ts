import * as jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import { IGetUserAuthInfoRequest } from '../types/types'
import { User } from '../models/user'
import { isStringObject } from 'util/types'
import * as dotenv from 'dotenv'

dotenv.config()
const auth = async function(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (token && process.env.JWT_SECRET) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      if (!isStringObject(decoded)) {
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
          throw new Error('You must log In to continue')
        }
        req.user = user
        req.token = token
        next()
      }
    } else {
      throw new Error()
    }
  } catch (e) {
    res.status(401).send({ error: 'You must log In to continue' })
  }
}

export { auth }
