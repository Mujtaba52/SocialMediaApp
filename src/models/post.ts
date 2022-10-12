import mongoose, { Schema, model, Types } from 'mongoose'
// import mongooseAutoPopulate from 'mongoose-autopopulate'

enum postType{
  CREATED = 'Created',
  SHARED = 'Shared'
}

interface IPost {
  _id?: Types.ObjectId;
  description: string;
  postedBy?: Types.ObjectId;
  postType?: postType;
  parent?: Types.ObjectId;
}

const postSchema: Schema = new Schema({

  description: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  postType: {
    type: String,
    required: true,
    default: postType.CREATED
  },
  parent: {
    type: mongoose.Types.ObjectId,
    default: null,
    ref: 'post'
  }
}, {
  timestamps: true
})

// postSchema.plugin(mongooseAutoPopulate)
const Post = model<IPost>('post', postSchema)

export { Post, IPost, postType }
