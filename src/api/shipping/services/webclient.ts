import WebClient from 'web-client-starter'

WebClient.interceptor.request(config => {
  if (config.data) {
    config.data = {
      ...config.data,
      data: {
        ...config.data.data,
        access_token: process.env.SHIPPING_ACCESS_TOKEN,
        secret_key: process.env.SHIPPING_SECRET_KEY
      }
    }
  }
  return config
})

export default WebClient
