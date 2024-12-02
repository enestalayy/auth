const { status } = require('http-status')
const UserService = require('~/services/user.service')
const TokenService = require('~/services/token.service')
const EmailService = require('~/services/email.service')
const handleAsync = require('~/utils/handleAsync')
const handleError = require('~/utils/handleError')
const { TokenTypes } = require('~/config/enums')

class UserController {
  constructor(service) {
    this.service = service
  }

  // Kullanıcı giriş
  getProfile = async (req, res, next) => {
    try {
      const [user, userError] = await this.getById(req.user._id, next)
      if (userError) next(userError).status(200).send({ success: true, user })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new UserController(UserService)
