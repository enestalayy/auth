const Joi = require('joi')

// Kullanıcı kayıt doğrulama
const registerValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir email adresi girin.',
    'any.required': 'Email alanı zorunludur.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Şifre en az 8 karakter olmalıdır.',
    'any.required': 'Şifre alanı zorunludur.',
  }),
})

// Kullanıcı giriş doğrulama
const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

// Token yenileme doğrulama
const refreshTokensValidation = Joi.object({
  refreshToken: Joi.string().required(),
})

module.exports = {
  registerValidation,
  loginValidation,
  refreshTokensValidation,
}
