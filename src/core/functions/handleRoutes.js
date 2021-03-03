const fs = require('fs');
const path = require('path')
const { Router } = require('express')

module.exports = (app) => {
  const apiPath = path.resolve(__dirname, '../../api/dir')
  const dirs = fs.readdirSync(apiPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        return { 
          name: dirent.name,
          path: path.resolve(apiPath, dirent.name) 
        }
      })

  const accessControl = require('../../middleware/accessControl')
  const injectModel = require('../../middleware/injectModel')
  const injectTemplates = require('../../middleware/injectTemplates')
  const Controller = require('../controller/Controller')


  dirs.forEach(dir => {
    const { path, name } = dir 
    const router = Router()
    const localController = require(`${path}/Controller`)
    const model = require(`${path}/Model`)
    let buffer = fs.readFileSync(`${path}/permissions.json`)
    const permissions = JSON.parse(buffer)

    const { isAllowed } = accessControl(permissions)

    controller = Object.assign(Controller, localController)

    buffer = fs.readFileSync(`${path}/routes.json`)
    const routes = JSON.parse(buffer)

    buffer = fs.readFileSync(`${path}/templates/pdf/templates.json`)
    let pdfTemplates = JSON.parse(buffer)

    const pdf = pdfTemplates.reduce((acc, template) => {
      template.fileName = `${path}/templates/pdf/${template.fileName}`
      acc[template.id] = template
      return acc
    }, {})

    buffer = fs.readFileSync(`${path}/templates/email/templates.json`)
    let emailTemplates = JSON.parse(buffer)

    const email = emailTemplates.reduce((acc, template) => {
      template.fileName = `${path}/templates/email/${template.fileName}`
      acc[template.id] = template
      return acc
    }, {})

    routes.forEach(r => {
      if (r.action === 'print' || r.action === 'email') {
        router[r.method](r.path, isAllowed(r.action), injectModel(model), injectTemplates({ pdf, email }), controller[r.action].bind(controller))
      } else {
        router[r.method](r.path, isAllowed(r.action), injectModel(model), controller[r.action].bind(controller))
      }
    })

    app.use(`/api/${name}`, router)
  })
}
