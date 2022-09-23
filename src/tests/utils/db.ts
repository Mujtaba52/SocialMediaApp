import { faker } from '@faker-js/faker'
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'
import { role, User, IUser, Post, IPost } from '../../models'
import * as jwt from 'jsonwebtoken'
dotenv.config()

const UserId = new mongoose.Types.ObjectId()
export const newUser = {
  _id: UserId,
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  userRole: role.MEMBER,
  tokens: [{
    token: jwt.sign({ _id: (UserId).toString() }, process.env.JWT_SECRET ?? '', { expiresIn: 60 * 60 })
  }]
}

export const generateUser = async() => {
  return await new User<IUser>(newUser).save()
}

export const deleteUser = async() => {
  await User.findByIdAndDelete(UserId)
}

export const createPostBy = async() => {
  return await new Post<IPost>({ _id: new mongoose.Types.ObjectId(), description: 'Mocha test post', postedBy: UserId }).save()
}

export const deletePost = async() => {
  await Post.deleteOne({ postedBy: UserId })
}
