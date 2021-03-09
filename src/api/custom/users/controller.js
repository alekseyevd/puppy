const Puppy = require('../../../core/Puppy')

module.exports = {
  async show(req, res, next) {
    const Model = Puppy.models.people
    const result = await Model.find()

    res.json(result)
  }
}