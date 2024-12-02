const express = require('express')
const validate = require('~/middlewares/validate.middleware')
const authenticate = require('~/middlewares/auth.middleware')
const userController = require('../controllers/user.controller')
const {} = require('../validations/user.validation')

const router = express.Router()

// Kullanıcı kayıt
router.get('/profile', authenticate(), userController.getProfile)

module.exports = router
