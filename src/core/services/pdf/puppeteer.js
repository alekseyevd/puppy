const puppeteer = require('puppeteer')

class Puppeter {
  async init() {
    this.browser = await puppeteer.launch({
      headless: true
    })
  }
}

module.exports = new Puppeter()
