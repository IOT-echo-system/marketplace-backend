import AuthService from '../services/auth'

export default ({strapi}) => ({
  async forgetPassword(ctx) {
    const {email} = ctx.request.body
    const authService = AuthService({strapi})
    try {
      await authService.forgetPassword(email)
      ctx.send({message: 'Email sent'})
    } catch (error) {
      ctx.throw(error)
    }
  },
  async updatePassword(ctx) {
    const {token, password} = ctx.request.body
    const authService = AuthService({strapi})
    try {
      await authService.updatePassword(token, password)
      ctx.send({message: 'Password updated successfully!!'})
    } catch (error) {
      ctx.throw(error)
    }
  }
})
