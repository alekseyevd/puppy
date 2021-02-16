module.exports = (error, req, res, next) => {
  res.status(error.status).json({
    result: false,
    message: error.message
  })
}