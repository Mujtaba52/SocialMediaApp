import mongoose, { Schema, model, Types } from 'mongoose'

interface IPost {
  _id?: Types.ObjectId;
  description: string;
  likes: Types.ObjectId[];
  postedBy?: Types.ObjectId;
  sharedBy: Array<{user: Types.ObjectId, sharedAt?: Date}>;
  parent?: Types.ObjectId;
  comments?: Array<{_id?: Types.ObjectId, text: string, likes?: Types.ObjectId[], tag?: Types.ObjectId[], postedBy: Types.ObjectId,
    replies?: Array<{text: string, likes?: Types.ObjectId[], tag?: Types.ObjectId[] }>, createdAt?: Date}>;
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
  }],
  comments: [{
    text: {
      type: String,
      required: true
    },
    likes: [{
      type: mongoose.Types.ObjectId,
      ref: 'user'
    }],
    tag: [{
      type: mongoose.Types.ObjectId,
      ref: 'user'
    }],
    postedBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    replies: [{
      text: {
        type: String,
        required: true
      },
      likes: [{
        type: mongoose.Types.ObjectId,
        ref: 'user'
      }],
      tag: [{
        type: mongoose.Types.ObjectId,
        ref: 'user'
      }]
    }]
  }],
  parent: {
    type: mongoose.Types.ObjectId,
    default: null,
    ref: 'post'
  }
}, {
  timestamps: true
})

const Post = model('post', postSchema)

export { Post, IPost }
