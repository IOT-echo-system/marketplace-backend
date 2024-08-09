export default ({env}) => ({
  ckeditor: {
    enabled: true,
    resolve: './src/plugins/strapi-plugin-ckeditor'
  },
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: env('SMTP_HOST', 'smtp.example.com'),
      port: env('SMTP_PORT', 587),
      auth: {
        user: env('SMTP_USERNAME'),
        pass: env('SMTP_PASSWORD'),
      },
      secure: true,
    },
    settings: {
      defaultFrom: 'iot@robotutortech.com',
      defaultReplyTo: 'iot@robotutortech.com',
    },
  }
})
