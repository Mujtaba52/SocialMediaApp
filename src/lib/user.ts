import { User } from '../models/user'
import { Following } from '../models'
import bcrypt from 'bcrypt'
import * as boom from '@hapi/boom'
import { transporter } from '../config/nodemailer'
import * as jwt from 'jsonwebtoken'
import Redis from 'ioredis'
import { isStringObject } from 'util/types'
import * as ejs from 'ejs'
const redis = new Redis()

const DEFAULT_EXPIRATION = 60
const maxNumberOfFailedLogins = 3
const signUp = async(userAttributes: any) => {
  const userExists = await User.findOne({ email: userAttributes.email })
  if (userExists) {
    throw boom.conflict('User already exists')
  }
  const user = new User(userAttributes)
  const newUser = await user.save()
  if (!process.env.ACCOUNT_AUTH_SECRET_KEY) {
    throw boom.notFound('Account authentication key missing')
  }
  const token = jwt.sign({ email: userAttributes.email }, process.env.ACCOUNT_AUTH_SECRET_KEY, { expiresIn: '30m' })
  const emailTemplate = await ejs.renderFile('views/authentication/authEmail.ejs'
    , { user_firstname: userAttributes.name, confirm_link: `http://localhost:4000/v1/users/authenticate/${token}`, token })
  transporter.sendMail({
    to: userAttributes.email,
    from: 'mujhassan786@outlook.com',
    subject: 'Account Authentication',
    html: emailTemplate
  })
  return newUser
}

const SignIn = async(userCredentials: any) => {
  const myUser = await User.findOne({ email: userCredentials.email })// .select('-tokens');
  let userAttempts: any = await redis.get(userCredentials.email) ?? 0
  if ((userAttempts ?? 0) > maxNumberOfFailedLogins) {
    throw boom.tooManyRequests('Too many incorrect attempts, try again one minute later')
  }

  if (!myUser) {
    throw boom.unauthorized('Invalid Email or Password')
  }
  const isMatch = await bcrypt.compare(userCredentials.password, myUser.password)
  if (!isMatch) {
    await redis.setex(userCredentials.email, DEFAULT_EXPIRATION, ++userAttempts)
    throw boom.unauthorized('Invalid Email or Password')
  }
  const token = await myUser.generateWebToken()
  return { myUser, token }
}

const authenticateUser = async(token: string) => {
  if (!process.env.ACCOUNT_AUTH_SECRET_KEY) {
    throw boom.notFound('Error Email Authentication token missing')
  }
  const userEmail = jwt.verify(token, process.env.ACCOUNT_AUTH_SECRET_KEY)
  if (!userEmail) {
    throw boom.conflict('Invalid verification link')
  }
  if (!isStringObject(userEmail)) {
    const userExists = await User.findOne({ email: userEmail.email })
    return userExists
  }
}

const signOut = async(tokens: any, currentAccountToken: any) => {
  const Updatedtokens = tokens.filter((token: any) => {
    return token.token !== currentAccountToken
  })
  return Updatedtokens
}

const forgotPassword = async(email: string) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw boom.notFound('User not found')
  }
  if (!process.env.ACCOUNT_AUTH_SECRET_KEY) {
    throw boom.notFound('Account authentication key missing')
  }
  const token = jwt.sign({ email }, process.env.ACCOUNT_AUTH_SECRET_KEY, { expiresIn: '30m' })
  transporter.sendMail({
    to: email,
    from: 'mujhassan786@outlook.com',
    subject: 'Password Updation',
    html: `<!DOCTYPE html>
    <html>
       Click on the following link to update your password: http://localhost:4000/v1/users/update_password/${token}
    </html>`
  })
  return 'Password updation email sent'
}

const updatePassword = async(password: string, token: any) => {
  console.log('hello')
  if (!process.env.ACCOUNT_AUTH_SECRET_KEY) {
    throw boom.notFound('Account authentication key missing')
  }
  const userExists = jwt.verify(token, process.env.ACCOUNT_AUTH_SECRET_KEY)
  if (!isStringObject(userExists)) {
    const updatedUser = await User.findOneAndUpdate({ email: userExists.email }, { password: await bcrypt.hash(password, 8) })
    await updatedUser?.save()
    return 'Password Updated successfully'
  }
}
const signOutAll = () => {
  return []
}

const followUser = async(currentUser: any, UserToFollow: String) => {
  const user = await User.findById(UserToFollow)
  if (!user) throw boom.notFound('User Not found')
  if (user._id === currentUser._id) throw boom.notFound('You cannot follow yourself')
  const usersBeingFollowed = await Following.find({ $and: [{ follower: currentUser._id }, { followee: UserToFollow }] })
  if (usersBeingFollowed.length >= 1) {
    throw boom.badRequest('User already followed')
  }
  const newfollowing = new Following({ follower: currentUser._id, followee: UserToFollow })
  return newfollowing.save()
}

const unfollowUser = async(currentUser: any, UserToUnfollow: String) => {
  const user = await User.findById(UserToUnfollow)
  if (!user) throw boom.notFound('User Not found')
  if (user._id === currentUser._id) throw boom.notFound('You cannot follow yourself')
  const usersBeingFollowed = await Following.find({ $and: [{ follower: currentUser._id }, { followee: UserToUnfollow }] })
  if (usersBeingFollowed.length <= 0) {
    throw boom.badRequest('User not being followed')
  }
  return Following.findOneAndDelete({ followee: UserToUnfollow })
}

const getFollowers = async(currentUser: any) => {
  const followersData = await Following.find({ followee: currentUser._id })
  return User.find({
    _id: {
      $in: followersData.map((val) => {
        return val.follower
      })
    }
  })
  // return followers
}

const getFollowing = async(currentUser: any) => {
  const followeesData = await Following.find({ follower: currentUser._id })
  return User.find({
    _id: {
      $in: followeesData.map((val) => {
        return val.followee
      })
    }
  })
  // return followees
}

const editUser = async(currentUser: any, editInfo: any) => {
  const user = User.findByIdAndUpdate(currentUser._id, editInfo, { new: true })
  return user
}

const deleteUser = async(currentUser: any) => {
  await User.findByIdAndDelete(currentUser._id)
  return { status: 'User successfully deleted' }
}

export {
  signUp, SignIn, signOut, signOutAll,
  followUser, deleteUser, editUser, unfollowUser,
  authenticateUser, forgotPassword, updatePassword,
  getFollowers, getFollowing
}
