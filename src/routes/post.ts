import * as express from 'express'
const router = express.Router();
import {createPost} from '../controllers/post'
import {auth} from '../middleware/auth'
import {createPostValidator} from '../validations/postValidation'

router.post('/createPost',createPostValidator,auth,createPost)

export {router}