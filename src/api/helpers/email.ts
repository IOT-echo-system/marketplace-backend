import nodemailer from 'nodemailer'
import {emailTemplates} from '../resources/emailTemplates'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
})

export const sendEmail = async (
  to: string,
  subject: string,
  template: keyof typeof emailTemplates,
  variables: Record<string, string>
) => {
  const body = Object.keys(variables).reduce((body, keyName) => {
    return body.replace(new RegExp(`\{\{${keyName}\}\}`, 'g'), variables[keyName])
  }, emailTemplates[template])

  await transporter.sendMail({from: process.env.SMTP_USERNAME, to, subject, html: body})
}
