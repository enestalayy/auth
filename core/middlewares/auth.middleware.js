const jwt = require('jsonwebtoken')
const httpStatus = require('http-status')
const { getUserById } = require('../services/user.service')
const { tokenTypes } = require('../config/tokens')
const config = require('../config/config')

const authenticate =
  (requiredRoles = []) =>
  async (req, res, next) => {
    try {
      const token = req.cookies.accessToken

      const payload = jwt.verify(token, config.jwt.secret)
      const user = await getUserById(payload.sub)

      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        return res.status(httpStatus.FORBIDDEN).json({ message: 'Forbidden' })
      }

      req.user = user
      next()
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' })
    }
  }

module.exports = authenticate
