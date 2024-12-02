const httpStatus = require('http-status')
const { env } = require('../config/config')

const errorHandler = (err, req, res, next) => {
  if (env === 'development') {
    console.error('err :>> ', err)
  }
  const statusCode = err.statusCode || 500
  const message = err.message || httpStatus[statusCode]
  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message,
    },
  })
}

module.exports = errorHandler
