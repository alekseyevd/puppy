module.exports = (templates) => (req, res, next) => {
  req.templates = templates
  next()
}