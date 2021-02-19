module.exports = (error, req, res, next) => {
  res.status(error.status || 500).json({
    result: false,
    message: error.message
  })
}