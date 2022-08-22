import { error } from 'console';
import {Request,Response} from 'express'
import { User } from '../models/user';
import bcrypt from "bcrypt"
import * as boom from "@hapi/boom"
import { any, string } from 'joi';
import { Types } from 'mongoose';
import { Post } from '../models/post';


const signUp = async (userAttributes:any)=>{
    
        const userExists = await User.findOne({email:userAttributes.email});
        if(userExists)
        {
            throw boom.conflict("User already exists")
        }
        const user = new User(userAttributes)
        const newUser = await user.save();
        return newUser;
}    

const SignIn = async (userCredentials:any)=>{
        const myUser = await User.findOne({ email:userCredentials.email });
        if (!myUser) {
            throw boom.unauthorized("Invalid Email or Password");
        }
        const isMatch = await bcrypt.compare(userCredentials.password, myUser.password);
        if (!isMatch) {
            throw boom.unauthorized("Invalid Email or Password");
        }
        myUser.generateWebToken();
        return myUser;
}

const signOut = async (tokens:any,currentAccountToken:any)=>{
    const Updatedtokens = tokens.filter((token:any) => {
        return token.token !== currentAccountToken;
        });
        return Updatedtokens
}

const signOutAll = ()=>{
        return []
}

const followUnfollowUser = async (currentUser:any,UserToFollowUnfollow:String)=>{

    const user = await User.findById(UserToFollowUnfollow)
    if(!user) throw boom.notFound("User Not found");
    if(user._id===currentUser._id) throw boom.notFound("You cannot follow yourself");        
    if(currentUser.following.includes(user._id) )
    {
        currentUser.following= currentUser.following.filter((id:any)=>{return id.toString()!==user._id.toString()})
        user.followers = user.followers?.filter((id:any)=>{ id.toString()!==currentUser._id.toString()})
        
        console.log("------User Unfollowed!------")
    }
    else{
        user.followers?.unshift(currentUser._id)
        currentUser.following.unshift(UserToFollowUnfollow)
        console.log("------User followed!------")
    }
    await user.save();
    return currentUser

}
const likePost = async (req:Request,res:Response)=>{
    
}

export {signUp,SignIn,signOut,likePost,signOutAll,followUnfollowUser}

