import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import type {Strapi} from '@strapi/strapi'
import {sendEmail} from '../../helpers/email'

const AuthService = ({strapi}: {strapi: Strapi}) => ({
  async forgetPassword(email: string) {
    const user = await strapi.query('plugin::users-permissions.user').findOne({where: {email}})

    if (!user) {
      new Error('User not found')
      return
    }
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/profile/reset-password?token=${resetToken}`
    await strapi.query('plugin::users-permissions.user').update({
      where: {id: user.id},
      data: {resetPasswordToken: resetToken}
    })
    await sendEmail(email, 'Reset password', 'resetPassword', {...user, resetPasswordUrl})
  },

  async updatePassword(token: string, password: string) {
    const user = await strapi.query('plugin::users-permissions.user').findOne({where: {resetPasswordToken: token}})
    if (!user) {
      throw new Error('Invalid or expired token')
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)
    return await strapi.query('plugin::users-permissions.user').update({
      where: {id: user.id},
      data: {password: hashedPassword, resetPasswordToken: null}
    })
  }
})
export default AuthService
