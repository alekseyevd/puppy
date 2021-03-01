const createError = require('http-errors')
const Handlebars = require("handlebars")
const fs = require('fs')
var pdf = require('html-pdf');

module.exports = (templates) => async (req, res, next) => {
  try {
    const Model = req.model
    if (!Model) throw createError(404, 'not found')

    const id = req.query.template_id
    if (!id) throw createError(400, 'bad request')

    if (!templates[id]) throw createError(404, 'template not found')

    const { documentName, fileName } = templates[id]

    const data = await Model.findOne({id: req.params.id})
    if (!data) throw createError(404, 'not found')

    const html = fs.readFileSync(fileName, 'utf-8')

    const compileTemplate = Handlebars.compile(html)
    const compileDocumentName = Handlebars.compile(documentName)

    pdf.create(compileTemplate(data.toObject()), {}).toBuffer( (err, buffer) => {
        if(err) throw err

        res.setHeader('content-type', 'application/pdf');
        res.setHeader('Content-disposition', `filename="${encodeURI(compileDocumentName(data.toObject()))}.pdf`)
        res.send(Buffer.from(buffer));
    })

  } catch (error) {
    next(error)
  }
}