import { Response } from 'express'
import { IGetUserAuthInfoRequest } from '../types/types'
import * as postlib from '../lib/post'

const createPost = async(req: IGetUserAuthInfoRequest, res: Response) => {
  const post = await postlib.createPost(req.body, req.user._id)
  res.status(200).send(post)
}

const sharePost = async(req: IGetUserAuthInfoRequest, res: Response) => {
  const post = await postlib.sharePost(req.user, req.params.id, req.body)
  res.status(200).send(post)
}

const getUserFeed = async(req: IGetUserAuthInfoRequest, res: Response) => {
  const { page = 1, limit = 2 } = req.query
  const posts = await postlib.getUserFeed(req.user, page, limit)
  res.status(200).send(posts)
}

const editPost = async(req: IGetUserAuthInfoRequest, res: Response) => {
  const post = await postlib.editPost(req.user, req.body, req.params.id)
  res.status(200).send(post)
}

const deletePost = async(req: IGetUserAuthInfoRequest, res: Response) => {
  const post = await postlib.deletePost(req.user, req.params.id)
  res.status(200).send(post)
}

const likePost = async(req: IGetUserAuthInfoRequest, res: Response) => {
  const post = await postlib.likePost(req.user, req.params.id)
  res.status(200).send(post)
}

const unlikePost = async(req: IGetUserAuthInfoRequest, res: Response) => {
  const post = await postlib.unlikePost(req.user, req.params.id)
  res.status(200).send(post)
}
export { createPost, sharePost, getUserFeed, deletePost, editPost, likePost, unlikePost }
