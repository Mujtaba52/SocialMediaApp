import * as express from 'express'
const router = express.Router();
import {createPost,sharePost,getUserFeed} from '../controllers/post'
import {auth} from '../middleware/auth'
import {createPostValidator} from '../validations/postValidation'

router.post('/createPost',createPostValidator,auth,createPost)

router.post('/sharePost/:id',auth,sharePost)

router.get('/userFeed',auth,getUserFeed)


//edit post 
//delete post

export {router}