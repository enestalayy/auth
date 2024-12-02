const rateLimit = require('express-rate-limit')

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Bu süre içinde en fazla 100 istek
  message: {
    success: false,
    error: {
      code: 429,
      message: 'Too many request',
    },
  },
  standardHeaders: true, // Rate limit bilgilerini `RateLimit-*` başlıklarında döner
  legacyHeaders: false, // `X-RateLimit-*` başlıklarını devre dışı bırakır
})

module.exports = rateLimiter
