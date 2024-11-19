const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Todo', todoSchema)
