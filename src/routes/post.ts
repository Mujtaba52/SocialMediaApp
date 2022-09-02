import * as express from 'express'
import {
  createPost, sharePost, getUserFeed, editPost, deletePost,
  likePost, unlikePost, commentOnPost, replyToComment
} from '../controllers/post'
import { asyncHandler } from '../helper'
import { createPostValidator } from '../validations/postValidation'
const router = express.Router()

router.post('', createPostValidator, asyncHandler(createPost))

router.post('/:id/share', asyncHandler(sharePost))

router.get('/feed', asyncHandler(getUserFeed))

router.put('/:id', asyncHandler(editPost))

router.delete('/:id', asyncHandler(deletePost))

router.patch('/:id/like', asyncHandler(likePost))

router.patch('/:id/unlike', asyncHandler(unlikePost))

router.patch('/:id/comment', asyncHandler(commentOnPost))

router.patch('/:id/comment/:commentId', asyncHandler(replyToComment))

export { router }
