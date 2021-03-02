const fs = require('fs');
const path = require('path')
const { Router } = require('express')

module.exports = (app) => {
  const dirs = fs.readdirSync(path.resolve(__dirname, '../../api/dir'), { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

  const accessControl = require('../../middleware/accessControl')
  const injectModel = require('../../middleware/injectModel')
  const injectTemplates = require('../../middleware/injectTemplates')
  const Controller = require('../controller/Controller')


  dirs.forEach(dir => {
    const router = Router()
    const localController = require(`../../api/dir/${dir}/Controller`)
    const model = require(`../../api/dir/${dir}/Model`)
    let buffer = fs.readFileSync(path.resolve(__dirname, `../../api/dir/${dir}/permissions.json`))
    const permissions = JSON.parse(buffer)

    const { isAllowed } = accessControl(permissions)

    controller = Object.assign(Controller, localController)

    buffer = fs.readFileSync(path.resolve(__dirname, `../../api/dir/${dir}/routes.json`))
    const routes = JSON.parse(buffer)

    buffer = fs.readFileSync(path.resolve(__dirname, `../../api/dir/${dir}/templates/pdf/templates.json`))
    let templates = JSON.parse(buffer)

    templates = templates.reduce((acc, template) => {
      template.fileName = path.resolve(__dirname, `../../api/dir/${dir}/templates/pdf/${template.fileName}`)
      acc[template.id] = template
      return acc
    }, {})

    routes.forEach(r => {
      if (r.action === 'print' || r.action === 'email') {
        router[r.method](r.path, /*isAllowed(r.action),*/ injectModel(model), injectTemplates(templates), controller[r.action].bind(controller))
      } else {
        router[r.method](r.path, isAllowed(r.action), injectModel(model), controller[r.action].bind(controller))
      }
    })

    app.use(`/api/${dir}`, router)
  })
}
