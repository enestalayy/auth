const express = require('express')
const validate = require('~/middlewares/validate.middleware')
const authenticate = require('~/middlewares/auth.middleware')
const authController = require('../controllers/auth.controller')
const { registerValidation, loginValidation, refreshTokensValidation } = require('../validations/auth.validation')

const router = express.Router()

// Kullanıcı kayıt
router.post('/register', validate(registerValidation), authController.register)

// Kullanıcı giriş
router.post('/login', validate(loginValidation), authController.login)

// Token yenileme
router.post('/refresh-tokens', validate(refreshTokensValidation), authController.refreshTokens)

// Kullanıcı çıkış
router.post('/logout', authenticate(), authController.logout)

module.exports = router
