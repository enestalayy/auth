const express = require('express')
const validate = require('~/middlewares/validate.middleware')
const authenticate = require('~/middlewares/auth.middleware')
const authController = require('../controllers/auth.controller')
const { registerValidation, loginValidation, verifyEmailValidation } = require('../validations/auth.validation')

const router = express.Router()

// Kullanıcı kayıt
router.post('/register', validate(registerValidation), authController.register)

// Kullanıcı giriş
router.post('/login', validate(loginValidation), authController.login)

router.post('/verify-email', validate(verifyEmailValidation), authController.verifyEmail)

router.post('/send-verify-email', validate(verifyEmailValidation), authController.sendVerifyEmail)

// Token yenileme
router.get('/refresh', authController.refreshTokens)

// Kullanıcı çıkış
router.post('/logout', authenticate(), authController.logout)

module.exports = router
