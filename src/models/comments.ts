import mongoose, { model, Types } from 'mongoose'
// import mongooseAutoPopulate from 'mongoose-autopopulate'
enum commentType{
  COMMENT = 'comment',
  REPLY = 'reply'
}
enum commentParent{
  COMMENT = 'comment',
  POST = 'post'
}
interface IComments {
  _id?: Types.ObjectId;
  text: string;
  tag?: Types.ObjectId[];
  postedBy?: Types.ObjectId;
  parent: string;
  commentType: commentType;
  parentId: Types.ObjectId;
}

const commentSchema: mongoose.Schema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  tag: [{
    type: mongoose.Types.ObjectId,
    ref: 'user'
  }],
  postedBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  parentId: {
    type: mongoose.Types.ObjectId,
    refPath: 'parent'
  },
  parent: {
    type: String,
    required: true,
    enum: ['comment', 'post']
  },
  commentType: {
    type: String,
    required: true
  }
},
{
  timestamps: true
})
// subTitles: [{ type: Schema.ObjectId, ref: 'workstructureSchema (dont know how you called it)' }],

// commentSchema.plugin(mongooseAutoPopulate)

const Comment = model<IComments>('comment', commentSchema)

export { commentSchema, IComments, Comment, commentType, commentParent }
