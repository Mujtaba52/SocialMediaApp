import { error } from 'console';
import {Request,Response} from 'express'
import { User } from '../models/user';
import bcrypt from "bcrypt"
import boom, { Boom } from "@hapi/boom"


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

const followUser = async (currentUser:any,UserToFollow:String)=>{

    console.log(currentUser)
    
    const user = await User.findById(UserToFollow)
    if(!user)
    {
        throw boom.notFound("User Not found");
    }
    console.log(user)
    user.followers?.unshift(currentUser._id)
    await user.save();
    currentUser.following.unshift(UserToFollow)
    return currentUser

}
const likePost = async (req:Request,res:Response)=>{
    try{

    }
    catch{
        
    }
}

const sharePost = async(req:Request,res:Response)=>{
    try{

    }
    catch{
        
    }
}


export {signUp,SignIn,signOut,likePost,sharePost,signOutAll,followUser}

