const { status } = require('http-status')
const handleError = require('../utils/handleError')
const { apiKey } = require('../config/config')

/**
 * API Key doğrulama middleware'i
 */
const apiKeyMiddleware = (req, res, next) => {
  const clientApiKey = req.headers['x-api-key'] // API Key header'dan alınır

  if (!clientApiKey) {
    return handleError(status.UNAUTHORIZED, next)
  }

  if (clientApiKey !== apiKey) {
    return handleError(status.FORBIDDEN, next)
  }

  next() // API Key geçerli, bir sonraki middleware'e geç
}

module.exports = { apiKeyMiddleware }
