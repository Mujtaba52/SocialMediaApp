import { Post } from '../models/post'
import { role } from '../models/user'
import boom from '@hapi/boom'

const createPost = async(postData: any, UserId: any) => {
  const post = new Post({ ...postData, postedBy: UserId })
  const myPost = await post.save()
  return myPost
}

const sharePost = async(currentUser: any, PostId: String, postData: any) => {
  const post = await Post.findById(PostId)
  if (!post) throw boom.notFound('Post Not found')
  const sharedpost = new Post({ description: postData.description, postedBy: currentUser._id, parentPost: PostId })
  post.sharedBy.unshift(currentUser._id)
  return sharedpost.save()
}

const getUserFeed = async(currentUser: any, page: any, limit: any) => {
  if (currentUser.userRole !== role.PREMIUM) {
    throw boom.unauthorized('This feature is for premium users only')
  }
  const postArr = await Post.find({
    postedBy: { $in: currentUser.following }
  })
    .populate('parentPost')
    .limit(Number(limit)).skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 })

  return postArr
}

const editPost = async(currentUser: any, postUpdate: any, PostId: String) => {
  let post = await Post.findById(PostId)
  if (!post) throw boom.notFound('Post Not found')
  if (post?.postedBy?.toString() !== currentUser._id.toString() && currentUser.userRole !== role.MODERATOR) {
    throw boom.unauthorized('Users can only edit their own post')
  }
  post = await Post.findByIdAndUpdate(PostId, postUpdate, { new: true })
  return post?.save()
}

const deletePost = async(currentUser: any, PostId: String) => {
  let post = await Post.findById(PostId)
  if (!post) throw boom.notFound('Post Not found')
  if (post?.postedBy?.toString() !== currentUser._id.toString() && currentUser.userRole !== role.MODERATOR) {
    throw boom.unauthorized('Users can only delete their own post')
  }

  post = await Post.findByIdAndDelete(PostId)
  return post
}
const likePost = async(currentUser: any, PostId: String) => {
  const post = await Post.findById(PostId)
  if (!post) throw boom.notFound('Post Not found')
  if (!post.likes.includes(currentUser._id)) {
    post.likes.unshift(currentUser._id)
    return post.save()
  }
  throw boom.notAcceptable('Post already liked')
}

const unlikePost = async(currentUser: any, PostId: String) => {
  const post = await Post.findById(PostId)
  if (!post) throw boom.notFound('Post Not found')
  if (post.likes.includes(currentUser._id)) {
    post.likes = post.likes.filter((id: any) => {
      return id.toString() !== currentUser._id.toString()
    })
    return post.save()
  }
  throw boom.notAcceptable('Post Not liked')
}
export { createPost, sharePost, getUserFeed, deletePost, editPost, likePost, unlikePost }
