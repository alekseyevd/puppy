const fs = require('fs');
const path = require('path')
const { Router } = require('express')

module.exports = (app) => {
  const dirs = fs.readdirSync(path.resolve(__dirname, '../api/dir'), { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

  const accessControl = require('../middleware/accessControl')
  const injectModel = require('../middleware/injectModel')
  const Controller = require('./controller/Controller')

  dirs.forEach(dir => {
    const router = Router()
    const localController = require(`../api/dir/${dir}/Controller`)
    const model = require(`../api/dir/${dir}/Model`)
    let buffer = fs.readFileSync(path.resolve(__dirname, `../api/dir/${dir}/permissions.json`))
    const permissions = JSON.parse(buffer)

    const { isAllowed } = accessControl(permissions)

    controller = Object.assign(Controller, localController)

    buffer = fs.readFileSync(path.resolve(__dirname, `../api/dir/${dir}/routes.json`))
    const routes = JSON.parse(buffer)

    routes.forEach(r => {
      router[r.method](r.path, isAllowed(r.action), injectModel(model), controller[r.action].bind(controller))
    })

    app.use(`/api/${dir}`, router)
  })
}