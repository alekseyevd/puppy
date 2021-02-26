const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const isAuthenticated = require('./middleware/authenticate')
const isAdmin = require('./middleware/isAdmin')
const handleRoutes = require('./core/handleRoutes')



const app = express()

app.use(cors())
app.use(express.json({ extended: true }))

app.use('/api/auth', require('./core/api/auth/router'))
app.use(isAuthenticated)

handleRoutes(app)

app.use('/api/users', isAdmin, require('./core/api/users/router'))
app.use(errorHandler)





module.exports = app
