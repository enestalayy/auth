const jwt = require('jsonwebtoken')
const { status } = require('http-status')
const userService = require('../services/user.service')
const { TokenTypes } = require('../config/enums')
const config = require('../config/config')

const authenticate =
  (requiredRoles = []) =>
  async (req, res, next) => {
    try {
      // Authorization başlığını kontrol et
      const authHeader = req.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(status.UNAUTHORIZED).json({ message: 'Unauthorized' })
      }
      // Bearer token'ı ayır
      const token = authHeader.split(' ')[1]
      if (!token) {
        return res.status(status.UNAUTHORIZED).json({ message: 'Unauthorized' })
      }
      console.log('token :>> ', token)
      const payload = jwt.verify(token, config.jwt.secret)
      console.log('payload :>> ', payload)
      const user = await userService.getUserById(payload.sub)
      console.log('user :>> ', user)
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
