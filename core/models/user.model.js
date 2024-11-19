const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { roles } = require('../utils/roles')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: roles,
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

userSchema.methods.isPasswordMatch = function (password) {
  return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)
