module.exports = (error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500).json({
    result: false,
    message: error.message
  })
}
