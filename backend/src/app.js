const express = require('express')
const cors = require('cors')
const path = require('path')
const routers = require('./routers/routers')

const app = express()

app.use(express.json())

app.use(cors({
  origin: ['https://noowaystore.vercel.app', 'http://localhost:5173'],
  credentials: false
}))

app.use(routers)
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))

module.exports = app
