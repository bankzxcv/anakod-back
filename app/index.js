const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const controller = require('./controller')

mongoose.connect(
  'mongodb://mongo:27017/anakod',
  { useNewUrlParser: true }
)

// form url encoded
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
// enable json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({ hello: true })
})

// API Add Keyword
app.post('/keyword', (req, res) => {
  console.log('keyword')
})

app.put('/keyword', (req, res) => {
  console.log('edit keyword')
})

// API aggegration
// 1. Sort top 3 areas
// 2. Sort top 3 tags
// 3. get List message ล่าสุด

const initStreaming = async () => {
  await controller.startStreaming()
}

initStreaming()

app.listen(4000, () => {
  console.log('server start')
})
