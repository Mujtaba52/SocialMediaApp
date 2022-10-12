import { Schema, model, Types } from 'mongoose'

enum Activity{
  COMMENT = 'comment',
  POST = 'post'
}

interface Ilikes extends Document{
  ActivityId: Types.ObjectId;
  UserID: Types.ObjectId;
  ActivityType: Activity;
}
const likesSchema = new Schema({
  ActivityId: {
    type: Types.ObjectId,
    refPath: 'Activities'
  },
  UserID: {
    type: Types.ObjectId,
    ref: 'user'
  },
  ActivityType: {
    type: String,
    required: true,
    enum: ['comment', 'post']
  }
},
{
  timestamps: true
})

const Likes = model<Ilikes>('likes', likesSchema)

export {
  Likes,
  Activity
}
