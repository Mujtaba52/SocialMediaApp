import { User } from '../models/user'
import bcrypt from 'bcrypt'
import * as boom from '@hapi/boom'

const signUp = async(userAttributes: any) => {
  const userExists = await User.findOne({ email: userAttributes.email })
  if (userExists) {
    throw boom.conflict('User already exists')
  }
  const user = new User(userAttributes)
  const newUser = await user.save()
  return newUser
}

const SignIn = async(userCredentials: any) => {
  const myUser = await User.findOne({ email: userCredentials.email })// .select('-tokens');
  if (!myUser) {
    throw boom.unauthorized('Invalid Email or Password')
  }
  const isMatch = await bcrypt.compare(userCredentials.password, myUser.password)
  if (!isMatch) {
    throw boom.unauthorized('Invalid Email or Password')
  }
  const token = await myUser.generateWebToken()
  return { myUser, token }
}

const signOut = async(tokens: any, currentAccountToken: any) => {
  const Updatedtokens = tokens.filter((token: any) => {
    return token.token !== currentAccountToken
  })
  return Updatedtokens
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

export { signUp, SignIn, signOut, signOutAll, followUser, deleteUser, editUser, unfollowUser }
