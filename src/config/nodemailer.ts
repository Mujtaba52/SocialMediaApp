import * as nodemailer from 'nodemailer'
import nodemailersendgrid from 'nodemailer-sendgrid'

if (!process.env.SENDGRID_APIKEY) {
  throw new Error('Enter Send Grid Api Key')
}
export const transporter = nodemailer.createTransport(
  nodemailersendgrid({
    apiKey: process.env.SENDGRID_APIKEY
  })
)
