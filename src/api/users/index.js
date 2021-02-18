const { Router } = require('express')
const User = require('../../models/User')
const authorize = require('../../middleware/authorize')
const checkPermissions = require('../../middleware/checkPermissions')

const router = Router()

router.get('/', authorize, checkPermissions('users.find'), async (req, res) => {

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
})

router.post('/', async (req, res) => {
  try {
    const { login, password, role } = req.body
    const user = new User({
      login,
      password, 
      role
    })
    await user.save()
    res.json(`User ${user.name} has been added`)
  } catch (error) {
    res.json({msg: error.message})
  }
})

module.exports = router