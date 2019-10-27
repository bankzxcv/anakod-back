const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema(
  {
    _id: String,
    description: String,
    status: {
      type: String
    },
    message: String,
    url: String,
    tags: [String],
    area_tags: String,
    created_time: Date,
    updated_time: Date
  },
  {
    strict: false,
    collection: 'ticket'
  }
)

module.exports = mongoose.model('ticket', MessageSchema)
