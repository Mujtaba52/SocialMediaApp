import * as express from 'express'
import { createPost, sharePost, getUserFeed, editPost, deletePost, likePost } from '../controllers/post'
import { createPostValidator } from '../validations/postValidation'
const router = express.Router()

router.post('/posts', createPostValidator, createPost)

router.post('/posts/:id/share', sharePost)

router.get('/posts/feed', getUserFeed)

router.put('/posts/:id', editPost)

router.delete('/posts/:id', deletePost)

router.patch('/posts/:id/like', likePost)

export { router }
