const { Router } = require('express')
const User = require('../../models/User')
const { compareSync, hashSync } = require('bcryptjs')
const { issueTokens } = require('../../services/auth')

const router = Router()

/**
 * @route   POST api/auth
 * @desc    User login
 * @access  Public
 */

router.post('/login', async (req, res) => {
  const { login, password } = req.body

  try {
    const user = await User.findOne({ login })

    if (!user || !compareSync(password, user.password)) {
      const error = new Error('Invalid login or password')
      error.status = 403
      throw error;
    }

    const tokens = await issueTokens(user.id)
    res.json(tokens)

  } catch (error) {
    //to-do error resolver
    res.json(error.message)
  }

})

router.post('/register', async (req, res) => {
  const { login, password } = req.body

  try {
    // to-do validate fields
    // const user = await User.findOne({ login })
    // if (user) throw Error('User alredy exist')

    const hashedPassword = hashSync(password, 10)

    const newUser = new User({
      login,
      password: hashedPassword
    })

    const saved = await newUser.save()
    if (!saved) throw Error('Smth wrong on saving user')

    res.json({ result: true })

  } catch (error) {
    res.json(error)
  }
})

module.exports = router