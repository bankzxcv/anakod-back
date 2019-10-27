const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema(
  {
    consumer_key: String,
    consumer_secret: String,
    access_token: String,
    access_token_secret: String
  },
  {
    strict: false,
    collection: 'token'
  }
)

module.exports = mongoose.model('token', tokenSchema)
