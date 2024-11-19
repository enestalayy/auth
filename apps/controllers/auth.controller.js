const httpStatus = require('http-status')
const userService = require('../../core/services/user.service')
const tokenService = require('../../core/services/token.service')
const handleAsync = require('../../core/utils/handleAsync')

// Kullanıcı kayıt
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Kullanıcı mevcut mu kontrolü
    const [existingUser, error] = handleAsync(this.service.getOne({ email }))
    if (existingUser) {
      const error = new Error()
      error.status
      return res.status(httpStatus.CONFLICT).json({ message: 'Bu email zaten kullanılıyor.' })
    }

    const user = handleAsync(this.service.create({ email, password }))
    const tokens = await tokenService.generateAuthTokens(user)

    return res.status(httpStatus.CREATED).send({ user, tokens })
  } catch (error) {
    next(error)
  }
}

// Kullanıcı giriş
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await userService.getUserByEmail(email)
    if (!user || !(await user.isPasswordMatch(password))) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Hatalı email veya şifre.' })
    }

    const tokens = await tokenService.generateAuthTokens(user)
    return res.status(httpStatus.OK).send({ user, tokens })
  } catch (error) {
    next(error)
  }
}

// Token yenileme
const refreshTokens = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    const tokens = await tokenService.refreshAuthTokens(refreshToken)
    return res.status(httpStatus.OK).send(tokens)
  } catch (error) {
    next(error)
  }
}

// Kullanıcı çıkış
const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Çıkış yaparken bir hata oluştu.' })
    }

    await tokenService.invalidateToken(refreshToken)
    res.clearCookie('refreshToken')
    res.status(httpStatus.NO_CONTENT).send()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  refreshTokens,
  logout,
}
