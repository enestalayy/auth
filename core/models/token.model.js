const mongoose = require('mongoose')
const { TokenTypes } = require('../config/enums')

const tokenSchema = new mongoose.Schema(
  {
    token: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(TokenTypes), required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
)

// user ve type bağlanır, yani aynı type'a sahip 2 aynı user olamaz ve type bu kullanımda indekslenmez.
tokenSchema.index({ userId: 1, type: 1 }, { unique: true })

// Type REFRESH değilse token indekslensin çünkü token araması yapılacak
tokenSchema.index({ token: 1 }, { partialFilterExpression: { type: { $ne: TokenTypes.REFRESH } } })

// Type REFRESH ise user indekslensin çünkü user araması yapılacak (her userın bir refresh tokenı olması için)
tokenSchema.index(
  { userId: 1 }, // user alanını indeksle
  { partialFilterExpression: { type: { $ne: TokenTypes.PASSWORD_RESET } } }
)
// TTL
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('Token', tokenSchema)
