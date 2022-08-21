import * as express from 'express'
const router = express.Router();
import {createPost,sharePost,getUserFeed,editPost,deletePost,likePost} from '../controllers/post'
import {auth} from '../middleware/auth'
import {createPostValidator} from '../validations/postValidation'

router.post('/createPost',createPostValidator,auth,createPost)

router.post('/sharePost/:id',auth,sharePost)

router.get('/userFeed',auth,getUserFeed)

router.patch('/editPost/:id',auth,editPost)

router.delete('/deletePost/:id',auth,deletePost)

router.post('/likePost/:id',auth,likePost)


export {router}