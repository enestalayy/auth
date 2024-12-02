const handleError = require('~/utils/handleError')
const { status } = require('http-status')

const validate = schema => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    return handleError(status.BAD_REQUEST, next)
  }
  next()
}

module.exports = validate
