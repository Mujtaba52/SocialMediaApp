import * as express from "express";
import {User} from "../models/user"
import { signUp,signIn,signOut,signOutAll,followUnfollowUser,goPremium } from "../controllers/user";
import {SignInValidator,SignUpValidator} from "../validations/userValidations"
import {auth} from "../middleware/auth"
const router = express.Router();

//CRUD update and delete 
router.post('/signup',SignUpValidator,signUp)

router.post('/signIn',SignInValidator,signIn)

router.post('/signOut',auth,signOut)

router.post('/signOutAll',auth,signOutAll)

router.post('/followUnfollowUser/:id',auth,followUnfollowUser)

router.post('/goPremium',auth,goPremium)
//update
//delete 
export {router}


// Build a Social network backend for users to connect and share posts. 
// A user should be able to sign up and follow/unfollow other users. 
// A feed will show all the posts by users we follow.
//  Additionally the feed can be hidden behind a paywall and integrated with stripe to create a subscription or a one time payment option. 
//  Another layer of users could be added to moderate the content on the network.