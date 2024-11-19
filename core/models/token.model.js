const mongoose = require('mongoose')
const { tokenTypes } = require('../config/tokens')

const tokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(tokenTypes), required: true },
    expires: { type: Date, required: true },
    blacklisted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Token', tokenSchema)
