const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const config = require('../config/config')
const { TokenTypes } = require('../config/enums')
const BaseService = require('./base.service')
const Token = require('../models/token.model')
const handleAsync = require('../utils/handleAsync')
const { status } = require('http-status')
const EmailService = require('./email.service')
const handleError = require('../utils/handleError')

class TokenService extends BaseService {
  constructor() {
    super(Token)
  }

  // Genel token oluşturma
  generateToken(userId, type, expiresIn) {
    const payload = { sub: userId, type }
    const options = { expiresIn }
    return jwt.sign(payload, config.jwt.secret, options)
  }

  async findAndUpdateToken(query, newToken) {
    const updatedData = {
      token: newToken,
      expiresAt: new Date(Date.now() + config.jwt.refreshExp * 24 * 60 * 60 * 1000),
    }
    const [tokenDoc, error] = await handleAsync(this.findOneAndUpdate(query, updatedData))
    return [tokenDoc, error]
  }

  async findAndDeleteToken(tokenId, type) {
    const [tokenDoc, error] = await handleAsync(this.delete(tokenId))
    return [tokenDoc, error]
  }

  // Auth token oluşturma
  generateAuthTokens(userId) {
    const accessToken = this.generateToken(userId, TokenTypes.ACCESS, `${config.jwt.accessExp}m`)

    const refreshToken = this.generateToken(userId, TokenTypes.REFRESH, `${config.jwt.refreshExp}d`)

    return { accessToken, refreshToken }
  }
  async saveRefreshToken(userId, token) {
    const refreshTokenData = {
      userId,
      token,
      type: TokenTypes.REFRESH,
      expiresAt: new Date(Date.now() + config.jwt.refreshExp * 24 * 60 * 60 * 1000),
    }

    const [updatedToken, error] = await handleAsync(this.findOneAndUpdate({ userId, type: TokenTypes.REFRESH }, refreshTokenData, { new: true, upsert: true }))

    return [updatedToken, error]
  }

  // Email verification token oluşturma
  async createAndSendEmailVerificationToken(user, next) {
    const [token, error] = await handleAsync(
      this.create({
        userId: user._id,
        type: TokenTypes.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 saat
      })
    )
    if (error) {
      // Aktif Token varsa conflict dön
      if (error.code === 11000) {
        return handleError(status.CONFLICT, next, 'Token already exists')
      }
      return next(error) // Diğer hatalar için genel hata yönetimi
    }
    const [verificationEmail, verificationEmailError] = await EmailService.sendVerificationEmail(user, token._id)
    return [verificationEmail, verificationEmailError]
  }
}

module.exports = new TokenService()
