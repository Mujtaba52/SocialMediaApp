import joi from 'joi';
import mongoose from 'mongoose';
import {Request,Response} from 'express';
import {IUser} from '../models/user';


const userSignup = joi.object<IUser>({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).required()
})

const userSignin = joi.object<IUser>({
    email: joi.string().email().required(),
    password: joi.string().min(3).required()
})

const SignUpValidator=(req:Request,res:Response,next:any)=>{
    const {error,value} = userSignup.validate(req.body,{abortEarly : false});
    if(error)return res.status(401).send(error.details)
    next();
    }

const SignInValidator=(req:Request,res:Response,next:any)=>{
    const {error,value} = userSignin.validate(req.body,{abortEarly : false});
    if(error)return res.status(401).send(error.details)
    next();
    }

export {
    SignUpValidator,
    SignInValidator
}
