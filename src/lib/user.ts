import { User } from '../models/user'
import bcrypt from 'bcrypt'
import * as boom from '@hapi/boom'
import { transporter } from '../config/nodemailer'
import * as jwt from 'jsonwebtoken'
import Redis from 'ioredis'
import { isStringObject } from 'util/types'
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
  transporter.sendMail({
    to: userAttributes.email,
    from: 'mujhassan786@outlook.com',
    subject: 'Account Authentication',
    html: `<!DOCTYPE html>
    <html>
       Click on the following link to authenticate your account creation: http://localhost:4000/v1/users/authenticate/${token}
    </html>`
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

const followUser = async(currentUser: any, UserToFollowUnfollow: String) => {
  const user = await User.findById(UserToFollowUnfollow)
  if (!user) throw boom.notFound('User Not found')
  if (user._id === currentUser._id) throw boom.notFound('You cannot follow yourself')
  if (!currentUser.following.includes(user._id)) {
    user.followers?.unshift(currentUser._id)
    currentUser.following.unshift(UserToFollowUnfollow)
    await user.save()
    return currentUser
  }
  throw boom.badRequest('User already followed')
}

const unfollowUser = async(currentUser: any, UserToFollowUnfollow: String) => {
  const user = await User.findById(UserToFollowUnfollow)
  if (!user) throw boom.notFound('User Not found')
  if (user._id === currentUser._id) throw boom.notFound('You cannot follow yourself')
  if (currentUser.following.includes(user._id)) {
    currentUser.following = currentUser.following.filter((id: any) => {
      return id.toString() !== user._id.toString()
    })
    user.followers = user.followers?.filter((id: any) => {
      return id.toString() !== currentUser._id.toString()
    })
    await user.save()
    return currentUser
  }
  throw boom.badRequest('User not being followed')
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
  authenticateUser, forgotPassword, updatePassword
}
