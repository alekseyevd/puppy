const { Router } = require('express')
const User = require('../../models/User')

const router = Router()

router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(400).json({ msg: error.message})
  }
})

router.post('/', async (req, res) => {
  console.log('post');
  try {
    const { name } = req.body
    const user = new User({
      name
    })
    await user.save()
    res.json(`User ${user} has been added`)
  } catch (error) {
    console.log(error);
  }
})

module.exports = router