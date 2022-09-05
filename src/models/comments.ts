import mongoose, { model, Types } from 'mongoose'
import mongooseAutoPopulate from 'mongoose-autopopulate'

interface IComments {
  _id?: Types.ObjectId,
  text: string,
  likes?: Types.ObjectId[],
  tag?: Types.ObjectId[],
  postedBy?: Types.ObjectId,
  replies?: Types.ObjectId[]
}

const commentSchema: mongoose.Schema<IComments> = new mongoose.Schema({
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
    type: mongoose.Types.ObjectId,
    ref: 'comment',
    autopopulate: true
  }]
})
// subTitles: [{ type: Schema.ObjectId, ref: 'workstructureSchema (dont know how you called it)' }],

commentSchema.plugin(mongooseAutoPopulate)

const Comment = model('comment', commentSchema)

export { commentSchema, IComments, Comment }
