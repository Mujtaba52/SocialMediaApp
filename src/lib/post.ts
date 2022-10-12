import { Post, postType, Comment, role, commentType, commentParent, Following } from '../models'
import { Likes, Activity } from '../models/likes'
import { CommentLikeCount } from '../models/commentLikeCount'
import boom from '@hapi/boom'

const createPost = async(postData: any, UserId: any) => {
  const post = new Post({ ...postData, postedBy: UserId, postType: postType.CREATED })
  const myPost = await post.save()
  return myPost
}

const getPosts = async(UserId: any) => {
  const post = await Post.find({ postedBy: UserId }).populate('parent')
  return post
}

const sharePost = async(currentUser: any, PostId: String, postData: any) => {
  const post = await Post.findById(PostId)
  if (!post) throw boom.notFound('Post Not found')
  const parentId = post.parent?.toString() ?? PostId
  const sharedpost = new Post({ description: postData.description, postedBy: currentUser._id, parent: parentId, postType: postType.SHARED })
  return sharedpost.save()
}

const getUserFeed = async(currentUser: any, page: any, limit: any) => {
  if (currentUser.userRole !== role.PREMIUM) {
    throw boom.unauthorized('This feature is for premium users only')
  }
  const UsersBeingfollowed = await Following.find({ follower: currentUser._id }, { followee: 1 })
  const CommentMadeByFollowedUsers = await Comment.find({
    postedBy: {
      $in: UsersBeingfollowed.map((value) => {
        return value.followee
      })
    }
  })
  const postArr = await Post.find({
    $or: [
      { postedBy: { $in: UsersBeingfollowed } },
      {
        postedBy: {
          $in: CommentMadeByFollowedUsers.map((value) => {
            return value._id
          })
        }
      },
      { likes: { $in: UsersBeingfollowed } },
      { postedBy: currentUser._id }
    ]
  })
    .populate('parent')
    // .populate({
    //   path: 'comments',
    //   populate: [{
    //     path: 'replies'
    //   }
    //   ]
    // })
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
  const isliked = await Likes.find({ ActivityId: PostId, UserID: currentUser._id })
  if (isliked.length > 0) {
    throw boom.notAcceptable('Post already liked')
  }
  const likeIt = new Likes({ ActivityId: PostId, UserID: currentUser._id, ActivityType: Activity.POST })
  likeIt.save()
  const likeCount = await CommentLikeCount.find({ ActivityId: PostId })
  if (likeCount.length === 0) {
    const firstLike = new CommentLikeCount({ ActivityId: PostId, likes: 1 })
    firstLike.save()
    return likeIt
  }
  await CommentLikeCount.findOneAndUpdate({ ActivityId: PostId }, { likes: likeCount[0].likes + 1 })
  return likeIt
}

const unlikePost = async(currentUser: any, PostId: String) => {
  const post = await Post.findById(PostId)
  if (!post) throw boom.notFound('Post Not found')
  const isliked = await Likes.find({ ActivityId: PostId, UserID: currentUser._id })
  if (isliked.length === 0) {
    throw boom.notAcceptable('Post Not liked')
  }
  const like = await Likes.findOneAndDelete({ ActivityId: PostId, UserID: currentUser._id })
  const likeCount = await CommentLikeCount.find({ ActivityId: PostId })
  if (likeCount[0].likes - 1 === 0) {
    await CommentLikeCount.findOneAndDelete({ ActivityId: PostId })
    return like
  }
  await CommentLikeCount.findOneAndUpdate({ ActivityId: PostId }, { likes: likeCount[0].likes - 1 })
  return like
}

const likecomment = async(currentUser: any, CommentId: String) => {
  const post = await Comment.findById(CommentId)
  if (!post) throw boom.notFound('Comment Not found')
  const isliked = await Likes.find({ ActivityId: CommentId, UserID: currentUser._id })
  if (isliked.length > 0) {
    throw boom.notAcceptable('Comment already liked')
  }
  const likeIt = new Likes({ ActivityId: CommentId, UserID: currentUser._id, ActivityType: Activity.COMMENT })
  likeIt.save()
  const likeCount = await CommentLikeCount.find({ ActivityId: CommentId })
  if (likeCount.length === 0) {
    const firstLike = new CommentLikeCount({ ActivityId: CommentId, likes: 1 })
    firstLike.save()
    return likeIt
  }
  await CommentLikeCount.findOneAndUpdate({ ActivityId: CommentId }, { likes: likeCount[0].likes + 1 })
  return likeIt
}

const commentOnPost = async(currentUser: any, PostId: String, comment: any) => {
  const post = await Post.findById(PostId)
  if (!post) throw boom.notFound('Post Not found')
  const newComment = await Comment.create({
    ...comment,
    postedBy: currentUser._id,
    parent: commentParent.POST,
    parentId: PostId,
    commentType: commentType.COMMENT
  })
  return newComment
}

const replyToComments = async(currentUser: any, CommentId: String, reply: any) => {
  const comment = await Comment.findById(CommentId)
  if (!comment) throw boom.notFound('Comment Not found')
  const newComment = await Comment.create({
    ...reply,
    postedBy: currentUser._id,
    parent: commentParent.COMMENT,
    parentId: CommentId,
    commentType: commentType.REPLY
  })
  // post.comments?.filter(comment =>
  //   comment._id && comment._id.toString() === CommentId ? comment.replies?.unshift({ ...reply, tag: comment.postedBy }) : comment)
  return newComment
}

export {
  createPost, sharePost, getUserFeed, deletePost,
  editPost, likePost, unlikePost, commentOnPost, replyToComments, getPosts, likecomment
}
