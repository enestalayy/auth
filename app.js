const express = require('express')
const config = require('~/config')
const errorHandler = require('~/middlewares/error.middleware')

const PORT = process.env.PORT || 3000
const app = express()
config(app)

// --- ROUTES ----
const routes = require('@/routes')
app.use('/api', routes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})

module.exports = app
