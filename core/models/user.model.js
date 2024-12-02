const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { Roles } = require('../config/enums')
const { default: status } = require('http-status')
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    role: {
      type: String,
      enum: Roles,
      default: 'USER',
    },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
  }
  next()
})

userSchema.statics.comparePasswordByEmail = async function (email, plainPassword) {
  // Sadece hash'i çek
  const user = await this.findOne({ email }).select('+password')

  if (!user) {
    return [null, status.NOT_FOUND]
  }

  // Şifreyi bcrypt ile karşılaştır
  const isMatch = await bcrypt.compare(plainPassword, user.password)

  if (!isMatch) {
    return [null, status.BAD_REQUEST]
  }
  user.password = undefined

  return [user, null]
}

module.exports = mongoose.model('User', userSchema)
