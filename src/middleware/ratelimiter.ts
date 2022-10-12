import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 1000, // 1 sec
  max: 2,
  message: 'Too many login tries from this IP, try after 1 second'
})
