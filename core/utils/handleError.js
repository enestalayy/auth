const handleError = (error, next) => {
  if (error instanceof Error) {
    return next(error)
  }
  const err = new Error()
  err.statusCode = error

  return new Error(error.message, error.statusCode, __filename)
}

module.exports = handleError
