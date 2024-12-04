const express = require('express')
require('module-alias/register')
const config = require('~/config')
const { port } = require('~/config/config')
const errorHandler = require('~/middlewares/error.middleware')
const { apiKeyMiddleware } = require('~/middlewares/apiKey.middleware')

const app = express()
config(app)

// app.use(apiKeyMiddleware)

// --- ROUTES ----
const routes = require('@/routes')
app.use('/api', routes)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

module.exports = app
