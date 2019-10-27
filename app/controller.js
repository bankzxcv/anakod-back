const Twit = require('twit')
const Token = require('./models/token.model')
const mongoose = require('mongoose')

let T

const postTweet = () => {
}

const editKeyword = () => {
}

const startStreaming = async () => {
  const item = await Token.findOne({}).exec()
}

module.exports = {
  postTweet,
  editKeyword,
  startStreaming
}