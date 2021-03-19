const createHttpError = require('http-errors')
const User = require('./Model')
const { hashSync } = require('bcryptjs')

module.exports = {
  async find(req, res, next) {
    try {
      const data = await User.find({ status: 1 }).select('-password')
      res.json({
        result: true,
        data
      })
    } catch (error) {
      next(error)
    }
  },

  async findOne(req, res, next) {
    try {
      const id = req.params.id
      const data = await User.findOne({ id }).select('-password')

      if (!data) throw createHttpError(404, 'not found')

      res.json({
        result: true,
        data
      })
    } catch (error) {
      next(error)
    }
  },

  async create(req, res, next) {
    const { login, password } = req.body

    // to-do validate fields
    try {
      const user = await User.findOne({ login })
      if (user) return next(createHttpError(409, 'User alredy exist'))

      const hashedPassword = hashSync(password, 10)

      const newUser = new User({
        ...req.body,
        password: hashedPassword
      })

      const data = await newUser.save()

      res.json({
        result: true,
        data
      })
    } catch (error) {
      return next(createHttpError(500, error.message))
    }
  },

  async update(req, res, next) {
    try {
      const id = req.params.id

      const data = req.body
      if (data.password) {
        req.body.password = hashSync(data.password, 10)
      } else delete data.password

      const result = await User.updateOne({ id }, data)

      if (result.n === 0) throw createHttpError(404, 'not found')

      // to-do what to return if id was found but not updated?
      res.json({
        result: true
      })
    } catch (error) {
      next(error)
    }
  },

  async deleteOne(req, res, next) {
    try {
      // to-do root user is not allowed to be deleted
      // to-do check if user id exists in others documents

      const id = req.params.id
      const result = await User.updateOne({ id }, { status: 3 }, { timestamps: false })

      if (result.n === 0) throw createHttpError(404, 'not found')

      if (result.nModified === 0) {
        await User.deleteOne({ id })
      }

      res.json({
        result: true
      })
    } catch (error) {
      next(error)
    }
  }
}
