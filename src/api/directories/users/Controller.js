const { hashSync } = require('bcryptjs')
const createHttpError = require('http-errors')

module.exports = {
  async update(req, res, next) {
    const Model = this.model
    try {
      const id = req.params.id

      if (req.permissions && req.permissions.fields && Array.isArray(req.permissions.fields)) {
        const selection = req.permissions.fields
        const postFields = Object.keys(req.body)
        const disallowed = postFields.filter(field => !selection.includes(field))
        if (disallowed.length > 0) {
          throw createHttpError(403, `Fields '${disallowed.join(', ')}' are forbidden to be updated for current role.`)
        }
      }

      const data = req.body

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

  async create(req, res, next) {
    const { login, password } = req.body
    const Model = this.model

    try {
      if (login.trim() === '') return next(createHttpError(400, 'login cant be empty'))
      if (password.trim() === '') return next(createHttpError(400, 'password cant be empty'))

      const user = await Model.findOne({ login })
      if (user) return next(createHttpError(409, 'User alredy exist'))

      const hashedPassword = hashSync(password, 10)

      const newUser = new Model({
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
}
