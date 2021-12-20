const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const express = require('express')

const cluster = require('cluster')
const numCPUs = require('os').cpus().length;
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongooseSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookie = require('cookie-parser')
const methodRouter = require('./router/method')
const mediaRouter = require('./router/media')
const userRouter = require('./router/user')
const errController = require('./controller/errorrController')
require('./db/mongoose')

const path = require('path')
const app = new express()
const port = process.env.PORT || 3000
if (cluster.isMaster) {
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {


  //set header
  app.use(helmet())

  //body parse
  app.use(express.json())
  app.use(cookie())

  app.use((req, res, next) => {
    next()
  })
  //set limit rate access
  const limit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:
      "Too many accounts created from this IP, please try again after an hour"
  })
  //clean data input
  app.use(mongooseSanitize())
  //prevent xss
  app.use(xss())
  //prevent paramater pollution
  app.use(hpp({
    whitelist: [
      'GamPerLitter'
    ]
  }))
  //serve static file
  app.use(express.static(path.join(__dirname, '../public')))
  app.use('/methods', limit, methodRouter)
  app.use('/media', limit, mediaRouter)
  app.use('/user', limit, userRouter)
  app.use(errController)

  app.get('/*', (req, res) => {

    res.sendFile(path.join(__dirname, '../public/index.html'))

  })

  app.listen(port, () => console.log('Server start'))
}


