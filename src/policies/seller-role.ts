export default async (ctx, next) => {
  const {user} = ctx.state
  if (!user) {
    return ctx.unauthorized('You must be authenticated.')
  }

  const requiredRole = 'admin'
  if (user.role && user.role.name === requiredRole) {
    return await next()
  }

  return ctx.unauthorized('You do not have the required role.')
}
