import { time, timeStamp } from 'console'
import mongoose, { Schema, model, Types } from 'mongoose'

interface IPost {
  _id?: Types.ObjectId;
  description: string;
  likes: Types.ObjectId[];
  postedBy?: Types.ObjectId;
  sharedBy: Array<{user: Types.ObjectId, sharedAt?: Date}>;
}

const postSchema: Schema<IPost> = new Schema({

  description: {
    type: String,
    required: true
  },
  likes: [{
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'user'
  }],
  postedBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  sharedBy: [{
    _id: false,
    sharedAt: {
      type: Date,
      default: new Date()
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'user'
    }
  }]
}, {
  timestamps: true
})

const Post = model('post', postSchema)

export { Post, IPost }
