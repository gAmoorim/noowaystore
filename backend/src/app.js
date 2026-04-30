const express = require('express')
const cors = require('cors')
const path = require('path')
const routers = require('./routers/routers')

const app = express()

app.use(express.json())
app.use(cors())
app.use(routers)
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))

module.exports = app
