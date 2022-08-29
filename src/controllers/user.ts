import {Request,response,Response} from 'express'
import { role, User } from '../models/user';
import * as userlib from '../lib/user'
import { Error } from 'mongoose';
import { Boom } from '@hapi/boom';
import {IGetUserAuthInfoRequest} from "../types/types"
import Stripe from 'stripe';

const publishable_key='pk_test_51LY80CC9gE7fmgQgnD7cwXbMpILGuIAppj6EwuN6Vsh4sb3eUEgyvmyYJ0PNXLFoNfzCN5kxEQYjTUWnjye1KdpD00AKCUn3dQ';
const secret_key='sk_test_51LY80CC9gE7fmgQgraV8583r0o2CpXBafHrrdbVduKvs1OTaW6KqIhmcIjdIr3UiNleU0IQ6Cqx5iSWPMNQlnBTr00nHOSdE5c';

const stripe = new Stripe(secret_key,{apiVersion: '2022-08-01'});

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
        const myUser=user.myUser
        const token =user.token
        res.status(200).send({myUser,token})
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

const goPremium = async (req:IGetUserAuthInfoRequest,res:Response)=>{
    try{
        stripe.customers.create({})
        stripe.charges.create({
            amount:2500,
            currency:'usd',
            source:req.body.card,
            receipt_email:req.user.email}).then((result)=>{
                req.user.userRole = role.PREMIUM;
                req.user.save();
                res.status(200).send({status:result.status})
            }).catch((err)=>{
                res.status(500).send(err)
            })
        }
    catch(e:any){
        res.status(e.output?.statusCode|| 400).send({Error:e.message} )
    }
}

const editUser = async (req:IGetUserAuthInfoRequest,res:Response)=>{
    try{
        const user= await userlib.editUser(req.user,req.body)
        res.status(200).send(user)
    }
    catch(e:any){
        res.status(e.output.statusCode).send({Error:e.message})
    }
    
}

const deleteUser = async (req:IGetUserAuthInfoRequest,res:Response)=>{
    try{
        const user= await userlib.deleteUser(req.user)
        res.status(200).send(user)
    }
    catch(e:any){
        res.status(e.output.statusCode).send({Error:e.message})
    }
    
}


export {signUp,signIn,signOut,signOutAll,followUnfollowUser,goPremium,editUser,deleteUser}