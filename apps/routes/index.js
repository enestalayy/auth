const express = require('express')

const TodoRoutes = require('./todo.routes')
const UserRoutes = require('./user.routes')
const AuthRoutes = require('./auth.routes')

const router = express.Router()

// Farklı rotaları `/api` altında birleştiriyoruz
router.use('/todos', TodoRoutes)
router.use('/users', UserRoutes)
router.use('/auth', AuthRoutes)

module.exports = router
