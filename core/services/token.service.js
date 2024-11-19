const BaseService = require('./BaseService')
const Token = require('../models/Token.model')

class TokenService extends BaseService {
  constructor() {
    super(Token) // Modeli BaseService'e aktar
  }
}

module.exports = new TokenService()
