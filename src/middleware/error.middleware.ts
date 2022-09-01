
import { NextFunction, Response } from 'express'
import { IGetUserAuthInfoRequest } from '../types/types'
import boom from '@hapi/boom'

export default (err: boom.Boom, req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): void => {
  res.status(err.output?.statusCode || 400).send({ Error: err.message })
}
