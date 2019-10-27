const mongoose = require('mongoose')

const IncrementSchema = new mongoose.Schema(
  {
    incr: {
      type: Number,
      default: 0
    }
  },
  {
    strict: false,
    collection: 'increment'
  }
)

module.exports = mongoose.model('increment', IncrementSchema)
