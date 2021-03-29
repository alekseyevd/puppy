const express = require('express')
const cors = require('cors')
const errorHandler = require('../middleware/errorHandler')
const isAuthenticated = require('../middleware/authenticate')
const isAdmin = require('../middleware/isAdmin')
const handleRoutes = require('./functions/handleRoutes')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json({ extended: true }))

app.get('/', (req, res) => {
  res.redirect('/app')
})

app.use('/app', express.static(path.resolve(__dirname, '../public')))
app.get('/app/*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'))
})

app.use('/api/auth', require('./services/auth/router'))

handleRoutes(app, 'directories')
handleRoutes(app, 'documents')
handleRoutes(app, 'custom')

// app.use('/api/users', isAuthenticated, isAdmin, require('./services/users/router'))
app.use('/api/users', require('./services/users/router'))

app.use(function(req, res) {
  res.status(404).send('Sorry cant find that!');
})
app.use(errorHandler)

module.exports = app
