const Joi = require('joi')

// Kullanıcı kayıt doğrulama
const registerValidation = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(8).max(30).required(),
  first_name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .lowercase()
    .regex(/^[a-zçğöşü\s-]+$/)
    .required(),
  last_name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .lowercase()
    .regex(/^[a-zçğöşü\s-]+$/)
    .required(),
})

const verifyEmailValidation = Joi.object({
  tokenId: Joi.string()
    .length(24)
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required(),
})

// Kullanıcı giriş doğrulama
const loginValidation = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(8).max(30).required(),
})

module.exports = {
  registerValidation,
  loginValidation,
  verifyEmailValidation,
}
