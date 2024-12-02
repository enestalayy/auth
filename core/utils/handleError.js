const { status } = require('http-status')

const handleError = (statusCode, next, message = null) => {
  const error = new Error(message || status[statusCode])
  error.statusCode = statusCode
  return next(error)
}

module.exports = handleError
