const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    _id: String,
    services: Object
  },
  {
    strict: false,
    collection: 'users'
  }
)

module.exports = mongoose.model('users', userSchema)
