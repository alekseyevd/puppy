module.exports = (model) => (req, res, next) => {
  req.model = model
  next()
}