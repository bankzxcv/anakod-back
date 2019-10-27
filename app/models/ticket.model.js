const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema(
  {
    _id: String,
    description: String,
    status: {
      type: String
    },
    message_id: String,
    url: String,
    tags: [String],
    area_tag: String,
    created_time: String,
    updated_time: String
  },
  {
    strict: false,
    collection: 'ticket'
  }
)

module.exports = mongoose.model('ticket', TicketSchema)
