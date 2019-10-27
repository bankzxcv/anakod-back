const Twit = require('twit')
const _ = require('lodash')
const Token = require('./models/token.model')
const mongoose = require('mongoose')

let T

const postTweet = () => {}

const editKeyword = () => {}

const startStreaming = async () => {
  const item = (await Token.findOne({}).exec()).toObject()
  const valueToken = _.pick(item, [
    'consumer_key',
    'consumer_secret',
    'access_token',
    'access_token_secret'
  ])
  console.log(valueToken)
  T = new Twit(valueToken)
}

module.exports = {
  postTweet,
  editKeyword,
  startStreaming
}
