const Twit = require('twit')
const _ = require('lodash')
const Token = require('./models/token.model')
const Ticket = require('./models/ticket.model')
const Message = require('./models/message.model')
const Keyword = require('./models/keyword.model')
const Incr = require('./models/increment.model')
const User = require('./models/user.model')

let T
let stream

const reply = (Twiter, { message_id, text }) => {
  return new Promise((resolve, reject) => {
    const build = {
      status: text,
      in_reply_to_status_id: message_id
    }
    console.log(build)
    Twiter.post('statuses/update', build, function (err, data, response) {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

const postTweet = async (req, res) => {
  try {
    const { user_id, message_id, text } = req.body
    const user = await User.findOne({ _id: user_id }).exec()
    const token = await Token.findOne({}).exec()
    const Twiter = new Twit({
      consumer_key: token.consumer_key,
      consumer_secret: token.consumer_secret,
      access_token: user.services.twitter.accessToken,
      access_token_secret: user.services.twitter.accessTokenSecret
    })
    const data = await reply(Twiter, { message_id, text })
    res.json({ error: false, data })
  } catch (e) {
    res.status(404).json({
      error: true,
      message: e.message
    })
  }
}

const getTicket = async (req, res) => {
  const { limit = '100' } = req.query
  try {
    const tickets = await Ticket.find()
      .sort({ created_time: 1 })
      .limit(+limit)
    res.json({
      error: false,
      data: tickets
    })
  } catch (e) {
    res.status(404).json({
      error: true,
      message: e.message
    })
  }
}

const createTicket = async (req, res) => {
  const { message_id, tags = [], area_tag = '' } = req.body
  try {
    if (!message_id) {
      throw new Error('no messageId')
    }
    const msg = await Message.findOne({ _id: message_id }).exec()
    if (!msg) {
      throw new Error('no Message')
    }
    const incr = await Incr.findOneAndUpdate(
      {},
      {
        $inc: {
          incr: 1
        }
      },
      {
        new: true
      }
    )
    const ticket = new Ticket({
      _id: `${incr.incr}`,
      description: `${msg.description}`,
      status: 'doing',
      message_id: msg._id,
      url: msg.url,
      tags,
      area_tag,
      created_time: new Date().toISOString(),
      updated_time: new Date().toISOString()
    })
    await ticket.save()
    res.json({
      error: false,
      data: ticket.toObject()
    })
  } catch (e) {
    res.status(404).json({
      error: true,
      message: e.message
    })
  }
}

const editTicket = async (req, res) => {
  const { ticketId, tags, status } = req.params
  try {
    const updatedValue = {
      ...(typeof status === 'string' && { status }),
      ...(typeof tags === 'object' && { tags })
    }
    const ticket = await Ticket.findOneAndUpdate(
      { ticket: ticketId },
      { $set: updatedValue },
      { new: true }
    ).exec()
    res.json({
      error: false,
      data: ticket.toObject()
    })
  } catch (e) {
    res.status(404).json({
      error: false,
      data: e.message
    })
  }
}

const formattedMessage = msg => {
  console.log('--------------')
  console.log(msg)
  console.log('--------------')
  const formatteddata = {
    _id: `${msg.id_str}`,
    _id_int: `${msg.id}`,
    description: msg.text,
    url: `https://twitter.com/${msg.user.screen_name}/status/${msg.id_str}`,
    profile_url: msg.user.profile_image_url_https,
    created_time: new Date(msg.created_at).toISOString(),
    updated_time: new Date().toISOString(),
    ticket_id: ''
  }
  return formatteddata
}

const setStreaming = (keywords = ['#hackafuture']) => {
  stream = T.stream('statuses/filter', {
    track: keywords
  })
  console.log(`set streaming with keywords: ${keywords}`)
  stream.on('tweet', async tweet => {
    try {
      const data = formattedMessage(tweet)
      if (data.description.startsWith('RT')) {
        console.log(`it's tweeter`)
        return
      }
      const message = new Message(data)
      const result = await message.save()
      console.log(result)
    } catch (e) {
      console.log(e)
    }
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
  console.log('start streaming')
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
