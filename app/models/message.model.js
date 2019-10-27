const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
    },
    screen_name: String,
    description: String,
    url: String,
    profile_url: String,
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
