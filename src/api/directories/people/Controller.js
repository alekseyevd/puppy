module.exports = {
  // find(req, res, next) {
  //   console.log(this.model);
  //   res.json({
  //     result: 888
  //   })
  // },

  beforeFind() {
    console.log('beforeFind');
  },
}
