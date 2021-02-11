const { Router } = require('express')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')

const router = Router()

/**
 * @route   POST api/auth
 * @desc    User login
 * @access  Public
 */

router.post('/', async (req, res) => {
  const { login, password } = req.body

  try {
    // to-fo validate fields
    const user = await User.findOne({ login })
    if (!user) throw Error('Invalid login or password')

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw Error('Invalid login or password')

    // to-do JWT

    res.json({
      id: user.id
    })
  } catch (error) {
    res.json({
      msg: error.message
    })
  }
})

module.exports = router