import {Request,Response} from 'express'
import { Post } from '../models/post';
import { role } from '../models/user';
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
    post.sharedBy.unshift({user:currentUser._id})
    return post.save();
}

const getUserFeed = async(currentUser:any,page:any,limit:any)=>{

    let userPosts = [];
    const postArr =  await Post.find({$or:[
        {postedBy:currentUser.following},{sharedBy:{$in:currentUser.following}}
    ] }).limit(Number(limit)).skip((Number(page)-1)*Number(limit)).select('-sharedBy').sort('createdAt')

    // //const sharedByUsersFollowing = await Post.find({sharedBy:currentUser.following})

    // let postArr= [...PostedByUsersFollowing,...sharedByUsersFollowing]
    //PostedByUsersFollowing.concat(sharedByUsersFollowing);
    return postArr
}

const editPost = async(currentUser:any,postUpdate:any, PostId:String)=>{
    let post = await Post.findById(PostId);
    if(!post) throw boom.notFound("Post Not found");
    if(post?.postedBy?.toString()!==currentUser._id.toString() && currentUser.userRole!==role.MODERATOR) throw boom.unauthorized("Users can only edit their own post");
    post = await Post.findByIdAndUpdate(PostId,postUpdate,{new: true})
    return post?.save();
}

const deletePost = async(currentUser:any, PostId:String)=>{

    let post = await Post.findById(PostId)
    if(!post) throw boom.notFound("Post Not found");
    if(post?.postedBy?.toString()!==currentUser._id.toString() && currentUser.userRole!==role.MODERATOR) throw boom.unauthorized("Users can only delete their own post");
    post = await Post.findByIdAndDelete(PostId)
    return post;
}
const likePost = async (currentUser:any, PostId:String)=>{
    let post = await Post.findById(PostId)
    if(!post) throw boom.notFound("Post Not found");
    if(post.likes.includes(currentUser._id) )
    {
        post.likes= post.likes.filter((id:any)=>{id!==currentUser._id})
        return post.save()
        console.log("------post unliked!------")
    }
    post.likes.unshift(currentUser._id)
    return post.save()
}


export {createPost,sharePost,getUserFeed,deletePost,editPost,likePost}