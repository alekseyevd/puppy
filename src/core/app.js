const express = require('express')
const cors = require('cors')
const errorHandler = require('../middleware/errorHandler')
const isAuthenticated = require('../middleware/authenticate')
const isAdmin = require('../middleware/isAdmin')
const handleRoutes = require('./functions/handleRoutes')

const app = express()

app.use(cors())
app.use(express.json({ extended: true }))

app.use('/api/auth', require('./services/auth/router'))
app.use(isAuthenticated)

handleRoutes(app, 'dir')

app.use('/api/users', isAdmin, require('./services/users/router'))
app.use(errorHandler)

module.exports = app
