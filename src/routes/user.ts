import * as express from 'express'
import { signUp, signIn, signOut, signOutAll, followUnfollowUser, goPremium, editUser, deleteUser } from '../controllers/user'
import { SignInValidator, SignUpValidator } from '../validations/userValidations'
import { auth } from '../middleware/auth'
const router = express.Router()

router.post('/sign_up', SignUpValidator, signUp)

router.post('/sign_in', SignInValidator, signIn)

router.use(auth)

router.post('/sign_out', signOut)

router.post('/sign_out_all', signOutAll)

router.post('/follow_un_follow/:id', followUnfollowUser)

router.post('/go_premium', goPremium)

router.patch('/', editUser)

router.delete('/', deleteUser)

export { router }
