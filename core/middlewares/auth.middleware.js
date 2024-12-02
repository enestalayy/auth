const jwt = require('jsonwebtoken')
const { status } = require('http-status')
const { getUserById } = require('../services/user.service')
const { TokenTypes } = require('../config/enums')
const config = require('../config/config')

const authenticate =
  (requiredRoles = []) =>
  async (req, res, next) => {
    try {
      console.log('req.cookies :>> ', req.cookies)
      const token = req.cookies.accessToken
      console.log('token :>> ', token)
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
