const fs = require('fs')
const Handlebars = require("handlebars")
const createError = require('http-errors')
const nodemailer = require("nodemailer")
const { EMAIL_SERVER, EMAIL_USER, EMAIL_PASSWORD } = require('../../../config')
const createPdf = require('../../services/pdf/Pdf')

module.exports = async function (req, res, next) {
  try {
    const { pdf_ids, template_id, to } = req.body
    const { pdf, email } = this.templates

    // to-do validate fields
    if (!to) throw createError(400, 'bad request')
    if (!template_id) throw createError(400, 'bad request')
    if (!email[template_id]) createError(400, 'bad request')

    const Model = this.model

    const entity = await Model.findOne({id: req.params.id})
    if (!entity) throw createError(404, 'not found')


    let attachments = []

    if (pdf_ids && Array.isArray(pdf_ids)) {
      attachments = await Promise.all(pdf_ids.filter(id => pdf[id] !== undefined)
        .map(id => {
          return new Promise((resolve, reject) => {
            const { documentName, fileName } = pdf[id]
            fs.readFile(fileName, 'utf-8', async (error, content) => {
              if (error) reject(error)

              //to-do create pdf buffer
              const buffer = await createPdf(content, entity.toObject())
              const compileDocumentName = Handlebars.compile(documentName)

              resolve({
                filename: `${compileDocumentName(entity.toObject())}.pdf`,
                content: Buffer.from(buffer),
              })
            })
          })
        }
      ))
    }

    const { fileName, subject } = email[template_id]
    const buffer = fs.readFileSync(fileName, 'utf-8')
    const html = Handlebars.compile(buffer)(entity.toObject())


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
      from: `"Fred Foo 👻" <mail@eurosteel-spb.ru>`, // sender address
      to, // list of receivers
      subject: Handlebars.compile(subject)(entity.toObject()),
      html,
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
