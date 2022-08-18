
import { Request,Response } from "express"
import { IGetUserAuthInfoRequest } from "../types/types"
import {Post} from "../models/post"
import * as postlib from "../lib/post"
import { User } from '../models/user';


const createPost =async (req:IGetUserAuthInfoRequest,res:Response)=>{
        const post = await postlib.createPost(req.body,req.user._id)
        res.status(200).send(post)
}

const sharePost = async(req:IGetUserAuthInfoRequest,res:Response)=>{
        try{
            const post= await postlib.sharePost(req.user,req.params.id);
            res.status(200).send(post)
        }
        catch(e:any){
            res.status(e.output?.statusCode|| 400).send({Error:e.message});
        }
}

const getUserFeed = async (req:IGetUserAuthInfoRequest,res:Response) => {
        try{
                const {page=1,limit=2}=req.query;
                const posts = await postlib.getUserFeed(req.user,page,limit)
                res.status(200).send(posts)
        }
        catch(e:any){
                res.status(e.output?.statusCode|| 400).send({Error:e.message});
        }
}

const editPost = async (req:IGetUserAuthInfoRequest,res:Response) => {
        try{
                const post = await postlib.editPost(req.user,req.body,req.params.id)
                res.status(200).send(post)
        }
        catch(e:any){
                res.status(e.output?.statusCode|| 400).send({Error:e.message});
        }
}

const deletePost = async (req:IGetUserAuthInfoRequest,res:Response) => {
        try{
                const post = await postlib.deletePost(req.user,req.params.id)
                res.status(200).send(post)
        }
        catch(e:any){
                res.status(e.output?.statusCode|| 400).send({Error:e.message});
        }
}

const likePost = async (req:IGetUserAuthInfoRequest,res:Response)=>{
        try{
                const post = await postlib.likePost(req.user,req.params.id)
                res.status(200).send(post)
        }
        catch(e:any){
                res.status(e.output?.statusCode|| 400).send({Error:e.message});
        }
    }
export {createPost,sharePost,getUserFeed,deletePost,editPost,likePost}