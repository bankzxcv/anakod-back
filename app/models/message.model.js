const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
    },
    description: String,
    url: String,
    created_time: Date,
    updated_time: Date,
    ticket_id: String
  },
  {
    strict: false,
    collection: 'message'
  }
)

module.exports = mongoose.model('message', MessageSchema)
