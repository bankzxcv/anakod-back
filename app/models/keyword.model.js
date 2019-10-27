const mongoose = require('mongoose')

const keywordSchema = new mongoose.Schema(
  {
    keywords: [],
    account_id: {
      type: String,
      default: '1'
    },
    created_time: String,
    updated_time: String
  },
  {
    strict: false,
    collection: 'Keyword'
  }
)

module.exports = mongoose.model('Keyword', keywordSchema)
