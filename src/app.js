const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json({ extended: true }))

app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))

module.exports = app
