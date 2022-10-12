import { model, Schema, Types } from 'mongoose'

interface ICommentLikeCount{
  ActivityId: Types.ObjectId;
  likes: number;
  comments: number;
}

const CommentLikeCountSchema = new Schema({
  ActivityId: {
    type: Types.ObjectId,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  }
})

const CommentLikeCount = model<ICommentLikeCount>('CommentLikeCount', CommentLikeCountSchema)

export {
  CommentLikeCount
}
