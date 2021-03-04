const fs = require('fs');
const path = require('path')
const { Router } = require('express')
const Puppy = require('../Puppy');

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
  const createDirModel = require('./createDirModel')


  dirs.forEach(dir => {
    const { path, name } = dir 
    const router = Router()
    const localController = require(`${path}/Controller`)
    //const model = require(`${path}/Model`)

    const schema = require(`${path}/schema`)
    const model = createDirModel(name, schema)

    //to-do register model in Puppy.models[name] = model
    //to do Object.defineProperty
    Puppy.models[name] = model

    let buffer = fs.readFileSync(`${path}/permissions.json`)
    const permissions = JSON.parse(buffer)

    const { isAllowed } = accessControl(permissions)

    //const controller = Object.assign(Controller, localController) 
    const controller = new Controller(name, localController)
    //todo controller.model = Model

    controller.model = model //to do delete

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
