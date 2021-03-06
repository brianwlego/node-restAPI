const path = require('path')

const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('dotenv').config()

const app = express();

const feedRoutes = require('./routes/feed')
const userRoutes = require('./routes/user')

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next();
})

app.use('/feed', feedRoutes)
app.use('/auth',userRoutes)

app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data
  res.status(status).json({message: message, data: data})
})


mongoose.connect(`mongodb+srv://brian:${process.env.DBPASSWORD}@cluster0.11orq.mongodb.net/messages?retryWrites=true&w=majority`, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
}) 
  .then(()=> {
    const server = app.listen(8080);
    const io = require('./socket').init(server)
    io.on('connection', socket => {
      console.log('client connected')
    })
  })
  .catch(err=>console.log(err))