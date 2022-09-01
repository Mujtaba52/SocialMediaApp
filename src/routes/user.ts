import * as express from 'express'
import { signUp, signIn, signOut, signOutAll, followUser, unfollowUser, goPremium, editUser, deleteUser } from '../controllers/user'
import { SignInValidator, SignUpValidator } from '../validations/userValidations'
import { auth } from '../middleware/auth'
import { asyncHandler } from '../helper/index'
const router = express.Router()

router.post('/sign_up', SignUpValidator, asyncHandler(signUp))

router.post('/sign_in', SignInValidator, asyncHandler(signIn))

router.use(auth)

router.post('/sign_out', asyncHandler(signOut))

router.post('/sign_out_all', asyncHandler(signOutAll))

router.post('/:id/follow', asyncHandler(followUser))

router.post('/:id/unfollow', asyncHandler(unfollowUser))

router.post('/go_premium', asyncHandler(goPremium))

router.patch('/', asyncHandler(editUser))

router.delete('/', asyncHandler(deleteUser))

export { router }
