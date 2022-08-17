import {Request,Response} from 'express'
import { Post } from '../models/post';
import boom, { Boom } from "@hapi/boom"

const createPost = async (postData:any,UserId:any)=>{
    console.log({...postData})
    const post = new Post({...postData,postedBy:UserId});
    const myPost = await post.save();
    return myPost;
}

const sharePost = async(currentUser:any, PostId:String)=>{

    const post = await Post.findById(PostId)
    if(!post) throw boom.notFound("Post Not found");
    post.sharedBy.unshift(currentUser._id)
    return post.save();
}

const getUserFeed = async(currentUser:any,page:any,limit:any)=>{

    let userPosts = [];
    const PostedByUsersFollowing =  await Promise.all( currentUser.following.map(async (id:any)=> {    
       return Post.find({postedBy:id})
    
    }))
    const sharedByUsersFollowing = await Promise.all(  currentUser.following.map(async (id:any)=> {
        return  Post.find({sharedBy:id})
    }))

    let postArr= [...PostedByUsersFollowing,...sharedByUsersFollowing]
    //PostedByUsersFollowing.concat(sharedByUsersFollowing);
    return postArr.slice((page - 1) * limit, page * limit); 
}
export {createPost,sharePost,getUserFeed}