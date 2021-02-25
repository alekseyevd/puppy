const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const isAuthenticated = require('./middleware/authenticate')
const isAdmin = require('./middleware/isAdmin')

const app = express()

app.use(cors())
app.use(express.json({ extended: true }))

app.use('/api/auth', require('./core/auth/router'))
app.use(isAuthenticated)

app.use('/api/users', isAdmin, require('./core/users/router'))
app.use('/api/dir', require('./api/dir/router'))
app.use(errorHandler)

module.exports = app
