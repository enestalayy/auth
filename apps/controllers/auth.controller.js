const { status } = require('http-status')
const UserService = require('~/services/user.service')
const TokenService = require('~/services/token.service')
const EmailService = require('~/services/email.service')
const handleAsync = require('~/utils/handleAsync')
const handleError = require('~/utils/handleError')
const { TokenTypes } = require('~/config/enums')
const { jwt } = require('~/config/config')

class AuthController {
  constructor(service) {
    this.service = service
    this.register = this.register.bind(this)
  }
  // Kullanıcı kayıt
  register = async (req, res, next) => {
    const { email } = req.body
    console.log('ÇALIŞIYORUM', req)
    const [existingUser, error] = await handleAsync(this.service.getOne({ email }))
    if (error) return next(error)

    if (existingUser && !existingUser.isEmailVerified) {
      return handleError(status.CONFLICT, next, 'Email is not verified')
    }
    if (existingUser && existingUser.isEmailVerified) {
      return handleError(status.CONFLICT, next, 'Email is already in use')
    }

    const [user, userError] = await handleAsync(this.service.create(req.body))
    if (userError) return next(userError)

    const [emailSent, emailError] = await TokenService.createAndSendEmailVerificationToken(user, next)
    if (emailError) next(emailError)
    console.log('emailSent :>> ', emailSent)
    return res.status(status.CREATED).send({ message: 'Verification email sent.' })
  }

  sendVerifyEmail = async (req, res, next) => {
    const { email } = req.body
    const [user, error] = await handleAsync(this.getOne({ email }))
    if (error) next(error)
    if (!user) handleError(status.BAD_REQUEST, next)
    const [emailSent, emailError] = await TokenService.createAndSendEmailVerificationToken(user, next)
    if (emailError) next(emailError)
    console.log('emailSent :>> ', emailSent)
    return res.status(status.CREATED).send({ message: 'Verification email sent.' })
  }

  verifyEmail = async (req, res, next) => {
    const { tokenId } = req.body

    const [tokenDoc, tokenErr] = await TokenService.findAndDeleteToken(tokenId, TokenTypes.EMAIL_VERIFICATION)

    if (tokenErr) {
      return next(tokenErr)
    }
    if (!tokenDoc) {
      return handleError(status.BAD_REQUEST, next)
    }
    const [response, error] = await this.service.verifyUsersEmail(tokenDoc.userId)
    if (error) next(error)
    res.status(status.OK).send(response)
  }

  // Kullanıcı giriş
  login = async (req, res, next) => {
    try {
      const [user, userError] = await this.service.checkUser(req.body, next)
      if (userError) next(userError)
      const { accessToken, refreshToken } = TokenService.generateAuthTokens(user._id)

      const [response, error] = await TokenService.saveRefreshToken(user._id, refreshToken)
      if (error) next(error)

      return res
        .cookie('accessToken', accessToken, {
          maxAge: jwt.accessExp * 1000,
        })
        .cookie('refreshToken', response.token, {
          maxAge: jwt.refreshExp * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .send({ success: true, user })
    } catch (error) {
      next(error)
    }
  }

  // Token yenileme
  refreshTokens = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookie

      const { newAccessToken, newRefreshToken } = TokenService.generateAuthTokens(req.user._id)

      const [response, error] = await TokenService.findAndUpdateToken({ userId: req.user._id, token: refreshToken }, newRefreshToken)
      if (error) next(error)
      if (!response) handleError(status.UNAUTHORIZED, next)
      return res
        .cookie('accessToken', newAccessToken, {
          maxAge: jwt.accessExp * 1000,
        })
        .cookie('refreshToken', response.token, {
          maxAge: jwt.refreshExp * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .send({ success: true })
    } catch (error) {
      next(error)
    }
  }

  // Kullanıcı çıkış
  logout = async (req, res, next) => {
    try {
      const refreshToken = req.cookie.refreshToken
      if (!refreshToken) {
        return res.status(status.BAD_REQUEST).json({ message: 'Çıkış yaparken bir hata oluştu.' })
      }

      await TokenService.invalidateToken(refreshToken)
      res.clearCookie('refreshToken')
      res.status(status.NO_CONTENT).send()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AuthController(UserService)
