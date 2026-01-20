const mongoose = require('mongoose')

const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: String
  },
  { timestamps: true }
)

module.exports = mongoose.model('Plant', plantSchema)
