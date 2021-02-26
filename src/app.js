const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const isAuthenticated = require('./middleware/authenticate')
const isAdmin = require('./middleware/isAdmin')

const fs = require('fs');
const path = require('path')
const { Router } = require('express')

const app = express()

app.use(cors())
app.use(express.json({ extended: true }))

app.use('/api/auth', require('./core/api/auth/router'))
app.use(isAuthenticated)

const dirs = fs.readdirSync(path.join(__dirname, 'api', 'dir'), { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const accessControl = require('./middleware/accessControl')
  
dirs.forEach(dir => {
  const router = Router()
  const Controller = require(`./api/dir/${dir}/Controller`)
  const model = require(`./api/dir/${dir}/Model`)
  const settings = fs.readFileSync(path.join(__dirname, `/api/dir/${dir}/permissions.json`))
  const permissions = JSON.parse(settings)

  const { isAllowed } = accessControl(permissions)
  const controller = new Controller({ model, permissions })

  router.get('/', isAllowed('find'), controller.find)
  router.get('/:id', isAllowed('findOne'), controller.findOne)
  router.post('/', isAllowed('create'), controller.create)
  router.post('/:id', isAllowed('update'), controller.update)
  router.delete('/:id', isAllowed('deleteOne'), controller.deleteOne)
  app.use(`/api/${dir}`, router)
})

app.use('/api/users', isAdmin, require('./core/api/users/router'))
app.use(errorHandler)





module.exports = app
