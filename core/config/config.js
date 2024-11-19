const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  corsOrigin: process.env.ALLOWED_ORIGINS,
  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET_KEY,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET_KEY,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || 30,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS || 30,
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
