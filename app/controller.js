const Twit = require('twit')
const _ = require('lodash')
const Token = require('./models/token.model')
const Message = require('./models/message.model')
const Keyword = require('./models/keyword.model')

let T
let stream

const postTweet = () => {}

const getTicket = async (req, res) => {}

const createTicket = async (req, res) => {
  const { messageId } = req.body
  try {
    if (!messageId) {
      throw new Error('no messageId')
    }
    const msg = Message.findOne({ _id: messageId }).exec()
  } catch (e) {
    res.status(404).json({
      error: true,
      message: e.message
    })
  }
}

const editTicket = async (req, res) => {
  const { ticketId } = req.params
}

const setStreaming = (
  keywords = ['#hackafuture', '#สวัสดีครับ', 'พรรคอนาคตใหม่']
) => {
  stream = T.stream('statuses/filter', {
    track: keywords
  })
  stream.on('tweet', tweet => {
    console.log(new Date(), tweet.user.screen_name, ':', tweet.text)
  })
}
const getKeyword = async (req, res) => {
  try {
    const keyword = await Keyword.find().exec()
    if (keyword.length === 0) {
      throw new Error('No keywords')
    }
    const { keywords } = keyword
    res.json({ error: false, data: keywords })
  } catch (e) {
    res.json({
      error: true,
      message: e.message
    })
  }
}

const editKeyword = async (req, res) => {
  const { keywords = [] } = req.body
  let id
  let keyword = await Keyword.findOne().exec()
  if (keyword) {
    keyword = await Keyword.findOneAndUpdate(
      { _id: keyword._id },
      {
        $set: {
          keywords: keywords,
          updated_time: new Date().toISOString()
        }
      },
      {
        new: true,
        upsert: true
      }
    ).exec()
  } else {
    const item = new Keyword({
      keywords,
      created_time: new Date().toISOString(),
      updated_time: new Date().toISOString()
    })
    await item.save()
  }
  // remove listener
  res.json({
    error: false,
    data: keywords
  })
}

const startStreaming = async () => {
  const item = (await Token.findOne({}).exec()).toObject()
  const valueToken = _.pick(item, [
    'consumer_key',
    'consumer_secret',
    'access_token',
    'access_token_secret'
  ])
  T = new Twit(valueToken)
  setStreaming()
}

module.exports = {
  postTweet,
  editKeyword,
  startStreaming,
  getKeyword,
  createTicket,
  editTicket,
  getTicket
}
