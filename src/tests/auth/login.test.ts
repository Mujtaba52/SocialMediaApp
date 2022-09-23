import chai from 'chai'
import chaiHttp from 'chai-http'
import { app } from '../../app'
import { IUser, User } from '../../models'
import { deleteUser, newUser } from '../utils/db'

chai.use(chaiHttp)

describe('User Sign In', () => {
  before(async() => {
    await new User<IUser>(newUser).save()
  })

  it('should return 401 if email or password not provided', () => {
    return chai.request(app)
      .post('/v1/users/sign_in')
      .send({ email: newUser.email })
      .then((res: any) => {
        chai.expect(res.text).to.contain('"\\"password\\" is required"')
        chai.expect(res.status).to.eql(401)
      })
  })

  it('should return 401 if email or password provided are incorrect', () => {
    return chai.request(app)
      .post('/v1/users/sign_in')
      .send({
        email: newUser.email,
        password: newUser.password + 'incorrect password'
      })
      .then((res: any) => {
        chai.expect(res.text).to.contain('Invalid Email or Password')
        chai.expect(res.status).to.eql(401)
      })
  })

  it('should return 200 if correct email and password provided', () => {
    return chai.request(app)
      .post('/v1/users/sign_in')
      .send({
        email: newUser.email,
        password: newUser.password
      })
      .then((res: any) => {
        chai.expect(res.text).to.contain('myUser')
        chai.expect(res.status).to.eql(200)
      })
  })

  after(async() => {
    deleteUser()
  })
})
