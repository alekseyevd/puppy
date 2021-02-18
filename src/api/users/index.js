const { Router } = require('express')
const User = require('../../models/Users')
const authorize = require('../../middleware/authorize')
const checkPermissions = require('../../middleware/checkPermissions')
const controller = require('./controllers/users')

const router = Router()

router.get('/', authorize, checkPermissions('users.find'), controller.find)

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