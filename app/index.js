const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const controller = require('./controller')

mongoose.connect(
  'mongodb://165.22.103.247:30001/anakod',
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

app.get('/keyword', controller.getKeyword)
// API Add Keyword
/*
body = ['อนาคตใหม่', 'สวัสดีจ้า']
*/
app.post('/keyword', controller.editKeyword)

app.get('/ticket',controller.getTicket)
app.post('/ticket', controller.createTicket)
app.put('/ticket/:ticketId', controller.editTicket)

app.get('/report/toparea', () => {})
app.get('/report/toptags', () => {})
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
