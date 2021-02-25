const createHttpError = require("http-errors")
const Model = require('./model')

module.exports = {
  async find (req, res, next) {
    try {
      const data = await Model.find().select('-password')
      res.json({
        result: true,
        data
      })
    } catch (error) {
      next(error)
    }
  },

  async findOne (req, res, next) {
    try {
      const id = req.params.id
      const data = await Model.findOne({ id }).select('-password')

      if (!data) throw createHttpError(404, 'not found')
  
      res.json({
        result: true,
        data
      })
    } catch (error) {
      next(error)
    }
  },

  // create,
  async update (req, res, next) {
    try {
      const id = req.params.id
      const result = await Model.updateOne({ id }, req.body)

      if (result.n === 0) throw createHttpError(404, 'not found')
  
      // to-do what to return if id was found but not updated?
      res.json({
        result: true
      })
    } catch (error) {
      next(error)
    }
  },

  async deleteOne (req, res, next) {
    try {
      // to-do root user is not allowed to be deleted

      const id = req.params.id
      const result = await Model.updateOne({ id }, { status: 3 })

      if (result.n === 0) throw createHttpError(404, 'not found')
  
      if (result.nModified  === 0) {
        await Model.deleteOne({ id })
      }
  
      res.json({
        result: true
      })
    } catch (error) {
      next(error)
    }
  }
}
