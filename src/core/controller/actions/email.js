const { rejects } = require('assert')
const fs = require('fs')
const Handlebars = require("handlebars")
const createError = require('http-errors')
const nodemailer = require("nodemailer")
const { EMAIL_SERVER, EMAIL_USER, EMAIL_PASSWORD } = require('../../../config')
const createPdf = require('../../services/pdf/Pdf')

module.exports = async function (req, res, next) {
  try {
    const Model = req.model
    if (!Model) throw createError(404, 'not found')

    const entity = await Model.findOne({id: req.params.id})
    if (!entity) throw createError(404, 'not found')

    const templates_ids = req.body.templates
    const templates = req.templates
    let attachments = []

    if (templates_ids && Array.isArray(templates_ids)) {
      attachments = await Promise.all(templates_ids.filter(template_id => templates[template_id] !== undefined)
        .map(template_id => {
          return new Promise((resolve, reject) => {
            const { documentName, fileName } = templates[template_id]
            fs.readFile(fileName, 'utf-8', async (error, content) => {
              if (error) reject(error)

              //to-do create pdf buffer
              const buffer = await createPdf(content, entity.toObject())
              const compileDocumentName = Handlebars.compile(`${documentName}.pdf`)

              resolve({
                filename: compileDocumentName(entity.toObject()),
                content: Buffer.from(buffer),
              })
            })
          })
        }
      ))
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      pool: true,
      host: EMAIL_SERVER,
      port: 465,
      secure: true, // use TLS
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
      }
    })

    // send mail with defined transport object
    let data = await transporter.sendMail({
      from: `"Fred Foo 👻" <${EMAIL_USER}>`, // sender address
      to: "alekseyev.d@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      html: "<b>Hello world?</b>", // html body
      attachments
    });

    res.json({
      result: true,
      data
    })

  } catch (error) {
    next(error)
  }
}
