const { mongoDBConnection } = require('./database')
const { configureApp } = require('./app')

module.exports = app => {
  configureApp(app)
  mongoDBConnection()
}
