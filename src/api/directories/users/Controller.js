const { hashSync } = require('bcryptjs')
const createHttpError = require('http-errors')

module.exports = {
  async update(req, res, next) {
    const Model = this.model
    try {
      const id = req.params.id

      const data = req.body
      if (data.password) {
        req.body.password = hashSync(data.password, 10)
      } else delete data.password

      const result = await Model.updateOne({ id }, data)

      if (result.n === 0) throw createHttpError(404, 'not found')

      // to-do what to return if id was found but not updated?
      res.json({
        result: true
      })
    } catch (error) {
      next(error)
    }
  },
}
