import { Request, Response } from 'express'
import { role } from '../models/user'
import * as userlib from '../lib/user'
import { IGetUserAuthInfoRequest } from '../types/types'
import Stripe from 'stripe'

// const publishable_key = 'pk_test_51LY80CC9gE7fmgQgnD7cwXbMpILGuIAppj6EwuN6Vsh4sb3eUEgyvmyYJ0PNXLFoNfzCN5kxEQYjTUWnjye1KdpD00AKCUn3dQ'
const secret_key = 'sk_test_51LY80CC9gE7fmgQgraV8583r0o2CpXBafHrrdbVduKvs1OTaW6KqIhmcIjdIr3UiNleU0IQ6Cqx5iSWPMNQlnBTr00nHOSdE5c'

const stripe = new Stripe(secret_key, { apiVersion: '2022-08-01' })

const signUp = async(req: Request, res: Response) => {
  const newUser = await userlib.signUp(req.body)
  res.status(200).send(newUser)
}

const signIn = async(req: Request, res: Response) => {
  const user = await userlib.SignIn(req.body)
  const myUser = user.myUser
  const token = user.token
  res.status(200).send({ myUser, token })
}

const signOut = async(req: IGetUserAuthInfoRequest, res: Response) => {
  req.user.tokens = await userlib.signOut(req.user.tokens, req.token)
  await req.user.save()
  res.status(200).send({ status: 'User Logged out' })
}

const signOutAll = async(req: IGetUserAuthInfoRequest, res: Response) => {
  req.user.tokens = userlib.signOutAll()
  await req.user.save()
  res.status(200).send({ status: 'All Users Logged out' })
}

const followUser = async(req: IGetUserAuthInfoRequest, res: Response) => {
  const user = await userlib.followUser(req.user, req.params.id)
  const updateduser = await user.save()
  res.status(200).send(updateduser)
}

const unfollowUser = async(req: IGetUserAuthInfoRequest, res: Response) => {
  const user = await userlib.unfollowUser(req.user, req.params.id)
  const updateduser = await user.save()
  res.status(200).send(updateduser)
}

const goPremium = async(req: IGetUserAuthInfoRequest, res: Response) => {
  stripe.paymentIntents.create({
    amount: 5900,
    currency: 'usd',
    payment_method_types: [req.body.card],
    receipt_email: req.user.email
  }).then((result) => {
    req.user.userRole = role.PREMIUM
    req.user.save()
    res.status(200).send({ status: result.status })
  }).catch((err) => {
    res.status(500).send(err)
  })
}

const editUser = async(req: IGetUserAuthInfoRequest, res: Response) => {
  const user = await userlib.editUser(req.user, req.body)
  res.status(200).send(user)
}

const deleteUser = async(req: IGetUserAuthInfoRequest, res: Response) => {
  const user = await userlib.deleteUser(req.user)
  res.status(200).send(user)
}

export { signUp, signIn, signOut, signOutAll, followUser, unfollowUser, goPremium, editUser, deleteUser }
