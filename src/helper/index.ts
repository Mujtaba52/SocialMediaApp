import { NextFunction, Response } from 'express'
import { IGetUserAuthInfoRequest } from '../types/types'

export const asyncHandler = (fn: (req: IGetUserAuthInfoRequest, res: Response, next?: NextFunction) => Promise<any>) =>
  (req: IGetUserAuthInfoRequest, res: Response, next?: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)
