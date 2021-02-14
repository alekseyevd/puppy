const { Router } = require('express')
const User = require('../../models/User')
const { compareSync, hashSync } = require('bcryptjs')
const AuthServise = require('../../services/authService')

const router = Router()

/**
 * @route   POST api/auth
 * @desc    User login
 * @access  Public
 */

router.post('/login', async (req, res) => {
  const { login, password } = req.body

  // to-do validate fields

  try {
    const user = await User.findOne({ login })

    if (!user || !compareSync(password, user.password)) {
      const error = new Error('Invalid login or password')
      error.status = 403
      throw error;
    }

    const tokens = await AuthServise.issueTokens({ id: user._id })
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

router.post('/refresh', async (req, res) => {
  try {
    const auth_headers = req.headers.authorization
    if (!auth_headers) throw Error('not authenticated')

    const token = auth_headers.split(' ')[1]
    if (!token) throw Error('not authenticated')

    const { refreshToken } = req.body
    if (!refreshToken) throw Error()

    const tokens = await AuthServise.refreshToken(refreshToken, token)
    if (!tokens) throw Error()
    res.json(tokens)

  } catch (error) {
    res.json(error)
  }
})

router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw Error()

    const result = await AuthServise.removeToken(refreshToken)
    if (!result) throw Error()

    res.json({ result: true })
  } catch (error) {
    res.json(error)
  }
})

module.exports = router