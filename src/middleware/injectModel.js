const mongoose = require('mongoose')

module.exports = (model) => {
  if (!(model.prototype instanceof mongoose.Model)) throw Error('model should be instans of mongoose.Model')

  return (req, res, next) => {
    req.model = model
    next()
  }
}