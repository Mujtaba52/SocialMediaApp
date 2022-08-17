import {Request,Response} from 'express'
import { User } from '../models/user';
import * as userlib from '../lib/user'
import { Error } from 'mongoose';
import { Boom } from '@hapi/boom';
import {IGetUserAuthInfoRequest} from "../types/types"

const signUp = async (req:Request,res:Response)=>{
    try{
        const newUser =  await userlib.signUp(req.body);
        res.status(200).send(newUser)
    }
    catch(e:any){
        res.status(e.output.statusCode).send({Error:e.message})
    }
}

const signIn = async (req:Request,res:Response)=>{
    try{
        const user= await userlib.SignIn(req.body)
        res.status(200).send(user)
    }
    catch(e:any){
        res.status(e.output.statusCode).send({Error:e.message})
    }
    
}

const signOut = async (req:IGetUserAuthInfoRequest,res:Response)=>{
    try{
        console.log(req.user.tokens)
        req.user.tokens = await userlib.signOut(req.user.tokens,req.token)
        await req.user.save();
        res.status(200).send({status : "User Logged out"});
    }
    catch(e:any){
        res.status(400).send({Error:e.message})
    }
}

const signOutAll = async (req:IGetUserAuthInfoRequest,res:Response)=>{
    try{
        req.user.tokens = userlib.signOutAll()
        await req.user.save();
        res.status(200).send({status : "All Users Logged out"});
    }
    catch(e:any){
        res.status(400).send({Error:e.message})
    }
}

const followUnfollowUser = async (req:IGetUserAuthInfoRequest,res:Response)=>{
    try{
        const user= await userlib.followUnfollowUser(req.user,req.params.id)
        const updateduser =await user.save()
        res.status(200).send(updateduser)
    }
    catch(e:any){
        res.status(e.output?.statusCode|| 400).send({Error:e.message} )
    }
}

const userFeed = async (req:IGetUserAuthInfoRequest,res:Response)=>{
    try{
        
    }
    catch(e:any){
        
    }
}

const likePost = async (req:Request,res:Response)=>{
    try{

    }
    catch{
        
    }
}


export {signUp,signIn,signOut,signOutAll,userFeed,followUnfollowUser}