const httpStatus = require('http-status')

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = httpStatus[statusCode]

  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message,
    },
  })
}

module.exports = errorHandler
