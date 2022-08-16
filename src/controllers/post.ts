
import { Request,Response } from "express"
import { IGetUserAuthInfoRequest } from "../types/types"
import {Post} from "../models/post"
import * as postlib from "../lib/post"


const createPost =async (req:IGetUserAuthInfoRequest,res:Response)=>{
        const post = await postlib.createPost(req.body,req.user._id)
        res.status(200).send(post)
}


export {createPost}