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
  const Controller = require('../controller/Controller')
  const createDirModel = require('./createDirModel')


  dirs.forEach(dir => {
    const { path, name } = dir 
    const router = Router()
    const localController = require(`${path}/Controller`)

    const schema = require(`${path}/schema`)
    const model = createDirModel(name, schema)

    let buffer = fs.readFileSync(`${path}/permissions.json`)
    const permissions = JSON.parse(buffer)

    const { isAllowed } = accessControl(permissions)

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

    //to-do register model in Puppy.models[name] = model
    //to do Object.defineProperty
    Puppy.models[name] = model
    Puppy.templates[name] = { pdf, email }
    const controller = new Controller(name, localController)

    //to-do add validators
    routes.forEach(r => {
      router[r.method](r.path, isAllowed(r.action), controller[r.action])
    })

    app.use(`/api/${name}`, router)
  })
}
