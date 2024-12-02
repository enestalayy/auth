const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8000,
  corsOrigin: process.env.ALLOWED_ORIGINS,
  appUrl: process.env.APP_URL,
  mongoDB_URI: process.env.MONGODB_CONNECTION_STRING,
  apiKey: process.env.API_KEY,
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    accessExp: 30,
    refreshExp: 30,
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    from: process.env.EMAIL_FROM,
  },
}
