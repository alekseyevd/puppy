const { compile } = require("handlebars");
const Handlebars = require("handlebars")
const puppeteer = require('../pdf/puppeteer')

module.exports = async (template, data) => {

  const compileTemplate = Handlebars.compile(template)
  const html = compileTemplate(data)

  const page = await puppeteer.browser.newPage()

  await page.setContent(html, {
    waitUntil: 'domcontentloaded'
  })

  const pdfBuffer = await page.pdf({
    format: 'A4'
  })



  //await browser.close()

  return pdfBuffer
}