require('module-alias/register')
const express = require('express')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const rateLimiter = require('./utils/rateLimiter')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const config = require('./config')
const logger = require('./utils/logger')
const cookieParser = require('cookie-parser')

require('dotenv/config')

const configureApp = app => {
  app.use(express.json())
  app.use(
    cors({
      origin: config.corsOrigin,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  app.use(compression())
  app.use(helmet())
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://apis.google.com'],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
      },
    })
  )
  app.use(
    helmet.hsts({
      maxAge: 31536000, // 1 yıl
      includeSubDomains: true,
    })
  )
  app.use(xss())
  app.use(mongoSanitize())
  app.use(cookieParser())

  if (config.env === 'production') {
    app.use(rateLimiter)
  }

  app.use((req, res, next) => {
    res.cookie('token', 'value', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: tokens.access.expires * 1000,
    })
    next()
  })

  app.use((err, req, res, next) => {
    logger.error(err.stack)
    res.status(err.status || 500).send({ error: err.message })
  })
}

module.exports = { configureApp }
