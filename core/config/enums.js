const Roles = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
  MODERATOR: 'MODERATOR',
})

const TokenTypes = Object.freeze({
  ACCESS: 'ACCESS',
  REFRESH: 'REFRESH',
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET',
})

module.exports = {
  Roles,
  TokenTypes,
}
