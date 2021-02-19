const User = require('../../../models/User')

module.exports = {
  async find(req, res) {
    const filter = JSON.parse(req.query.filter)
    console.log(filter);
  
    try {
      // to-do add query params to filter
      if (req.permissions && req.permissions.own) {
        filter.owner =  req.user.id
      }
  
      let selection = []
      if (req.permissions && req.permissions.fields && Array.isArray(req.permissions.fields)) {
        selection = req.permissions.fields
      }
  
      let users = await User.find(filter).select(selection)
      res.json(users)
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message})
    }
  },

  async findOne() {}
}