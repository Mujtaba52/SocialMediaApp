import chai from 'chai'
import chaiHttp from 'chai-http'
import * as dotenv from 'dotenv'
import { afterEach } from 'mocha'
import { app } from '../../app'
import { generateUser, deleteUser, createPostBy, deletePost } from '../utils/db'

dotenv.config()
chai.use(chaiHttp)

describe('Get Posts', () => {
  it('testing get posts end point', async() => {
    const user = await generateUser()
    const post = await createPostBy()
    const res = await chai.request(app)
      .get('/v1/posts')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
    chai.expect(res.text).to.contain(`${post.description}`)
    chai.expect(res.status).to.eql(200)
  })

  afterEach(() => {
    deletePost()
    deleteUser()
  })
})
