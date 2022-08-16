import {Request,Response} from 'express'
import { Post } from '../models/post';
import boom, { Boom } from "@hapi/boom"

const createPost = async (postData:any,UserId:any)=>{
    console.log({...postData})
    const post = new Post({...postData,postedBy:UserId});
    const myPost = await post.save();
    return myPost;
}

export {createPost}