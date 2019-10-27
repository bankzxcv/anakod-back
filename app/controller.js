const Twit = require('twit')
const _ = require('lodash')
const Token = require('./models/token.model')
const Ticket = require('./models/ticket.model')
const Message = require('./models/message.model')
const Keyword = require('./models/keyword.model')
const Incr = require('./models/increment.model')

let T
let stream

const postTweet = (req, res) => {
  // const { userId, twitter_id, message } = req.body
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
  const { messageId, tags = [], area_tag = '' } = req.body
  try {
    if (!messageId) {
      throw new Error('no messageId')
    }
    const msg = await Message.findOne({ _id: messageId }).exec()
    if (!msg) {
      throw new Error('no Message')
    }
    const incr = Incr.findOneAndUpdate(
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
      _id: `${msg.incr}`,
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
    const ticket = Ticket.findOneAndUpdate(
      { ticket },
      { $set: updatedValue },
      { new: true }
    ).exec()
  } catch (e) {
    res.status(404).json({
      error: false,
      data: e.message
    })
  }
}

const formattedMessage = msg => {
  const formatteddata = {
    _id: msg.id_str,
    description: msg.text,
    url: `https://twitter.com/${msg.user.screen_name}/status/${msg.id_str}`,
    profile_url: msg.user.profile_image_url_https,
    created_time: new Date(msg.created_at).toISOString(),
    updated_time: new Date().toISOString(),
    ticket_id: ''
  }
  return formatteddata
}

const setStreaming = (
  keywords = ['#hackafuture', '#ร้องทุกข์', 'พรรคอนาคตใหม่']
) => {
  stream = T.stream('statuses/filter', {
    track: keywords
  })
  console.log(`set streaming with keywords: ${keywords}`)
  stream.on('tweet', async tweet => {
    try {
      const data = formattedMessage(tweet)
      console.log(data)
      if (data.description.startsWith('RT ')) {
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
