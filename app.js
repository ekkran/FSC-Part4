const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')

app.use(express.json())

const blogsRouter = require('./controllers/blog')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use('/api/blogs', blogsRouter)

module.exports = app