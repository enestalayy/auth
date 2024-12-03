const jwt = require('jsonwebtoken')
const { status } = require('http-status')
const { getUserById } = require('../services/user.service')
const { TokenTypes } = require('../config/enums')
const config = require('../config/config')

const authenticate =
  (requiredRoles = []) =>
  async (req, res, next) => {
    try {
      // Authorization başlığını kontrol et
      const authHeader = req.headers.authorization
      console.log('req.headers :>> ', req.headers)
      console.log('authHeader :>> ', authHeader)

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(status.UNAUTHORIZED).json({ message: 'Unauthorized' })
      }
      // Bearer token'ı ayır
      const token = authHeader.split(' ')[1]
      if (!token) {
        return res.status(status.UNAUTHORIZED).json({ message: 'Unauthorized' })
      }
      const payload = jwt.verify(token, config.jwt.secret)
      const user = await getUserById(payload.sub)

      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        return res.status(status.FORBIDDEN).json({ message: 'Forbidden' })
      }

      req.user = user
      next()
    } catch (error) {
      return res.status(status.UNAUTHORIZED).json({ message: 'Unauthorized' })
    }
  }

module.exports = authenticate
