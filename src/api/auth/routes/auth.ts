export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/forget-password',
      handler: 'auth.forgetPassword',
      config: {
        policies: []
      }
    },
    {
      method: 'POST',
      path: '/auth/update-password',
      handler: 'auth.updatePassword',
      config: {
        policies: []
      }
    }
  ]
}
