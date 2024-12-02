const BaseService = require('./base.service')
const User = require('../models/user.model')
const Token = require('../models/token.model')
const { status } = require('http-status')
const handleAsync = require('../utils/handleAsync')
const handleError = require('../utils/handleError')
class UserService extends BaseService {
  constructor() {
    super(User) // Modeli BaseService'e aktar
  }
  async verifyUsersEmail(id) {
    const [response, error] = await handleAsync(this.update(id, { isEmailVerified: true }))
    return [response, error]
  }
  async checkUser(userInfo, next) {
    const { email, password } = userInfo
    const [user, error] = await User.comparePasswordByEmail(email, password)

    if (error) {
      return handleError(error, next)
    }

    if (!user.isEmailVerified) return handleError(status.UNAUTHORIZED, next)
    return [user, error]
  }
}

module.exports = new UserService()
