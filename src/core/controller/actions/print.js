const createError = require('http-errors')
const Handlebars = require("handlebars")
const fs = require('fs')
//var pdf = require('html-pdf');
const createPdf = require('../../services/pdf/Pdf')

module.exports = async function (req, res, next) {
  try {
    const Model = this.model

    const id = req.query.template_id
    if (!id) throw createError(400, 'bad request')

    const templates = this.templates.pdf
    if (!templates[id]) throw createError(404, 'template not found')

    const { documentName, fileName } = templates[id]

    const data = await Model.findOne({id: req.params.id})
    if (!data) throw createError(404, 'not found')

    const template = fs.readFileSync(fileName, 'utf-8')

    const compileDocumentName = Handlebars.compile(documentName)

    const buffer = await createPdf(template, data.toObject())
    
    res.setHeader('content-type', 'application/pdf');
    res.setHeader('Content-disposition', `filename="${encodeURI(compileDocumentName(data.toObject()))}.pdf`)
    res.send(Buffer.from(buffer));

  } catch (error) {
    next(error)
  }
}