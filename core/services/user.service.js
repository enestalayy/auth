const BaseService = require('./BaseService')
const User = require('../models/user.model')

class UserService extends BaseService {
  constructor() {
    super(User) // Modeli BaseService'e aktar
  }
}

module.exports = new UserService()
