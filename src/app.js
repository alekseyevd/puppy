const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json({ extended: true }))

app.use('/api/users', require('./api/users'))
app.use('/api/auth', require('./api/auth'))
app.use(errorHandler)

module.exports = app
