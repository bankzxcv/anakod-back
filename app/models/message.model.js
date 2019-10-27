const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
    },
    description: String,
    url: String,
    created_time: String,
    updated_time: String,
    ticket_id: String
  },
  {
    strict: false,
    collection: 'Message'
  }
)

module.exports = mongoose.model('Message', MessageSchema)
