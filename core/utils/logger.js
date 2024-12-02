const winston = require('winston')
const { env } = require('../config/config')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'auth-service' },
  transports: [new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), new winston.transports.File({ filename: 'logs/combined.log' })],
})

if (env !== 'production') {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }))
}

module.exports = logger
