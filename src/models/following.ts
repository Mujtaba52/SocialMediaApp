import { model, Types, Schema } from 'mongoose'

interface Ifollowing extends Document{
  follower: Types.ObjectId;
  followee: Types.ObjectId;
}

const followingSchema: Schema = new Schema({
  follower: {
    type: Types.ObjectId,
    required: true,
    ref: 'user'
  },
  followee: {
    type: Types.ObjectId,
    required: true,
    ref: 'user'
  }
}, {
  timestamps: true
})

const Following = model<Ifollowing>('following', followingSchema)

export {
  Following,
  Ifollowing
}
