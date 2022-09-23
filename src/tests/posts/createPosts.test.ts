import chai from 'chai'
import chaiHttp from 'chai-http'
import * as dotenv from 'dotenv'
import { app } from '../../app'
import { User, IUser } from '../../models/user'
import { newUser, deletePost, deleteUser } from '../utils/db'

dotenv.config()
chai.use(chaiHttp)

describe('User create Post', () => {
  before(async() => {
    await new User<IUser>(newUser).save()
  })

  it('should return 401 if user not logged in', async() => {
    const res = await chai.request(app)
      .post('/v1/posts')
      .send({})
    chai.expect(res.text).to.contain('You must log In to continue')
    chai.expect(res.status).to.eql(401)
  })

  it('should return 401 if no description is passed', async() => {
    const res = await chai.request(app)
      .post('/v1/posts')
      .set('Authorization', `Bearer ${newUser.tokens[0].token}`)
      .send()
    chai.expect(res.text).to.contain('"\\"description\\" is required')
    chai.expect(res.status).to.eql(401)
  })

  it('should return 200 if description is passed', async() => {
    const res = await chai.request(app)
      .post('/v1/posts')
      .set('Authorization', `Bearer ${newUser.tokens[0].token}`)
      .send({ description: 'Mocha test post' })
    chai.expect(res.text).to.contain('description')
    chai.expect(res.status).to.eql(200)
    deletePost()
  })

  after(async() => {
    deleteUser()
  })
})
