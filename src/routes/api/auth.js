const { Router } = require('express')
const User = require('../../models/User')
const { compareSync, hashSync } = require('bcryptjs')
const AuthServise = require('../../services/authService')
const createError = require('http-errors')

const router = Router()

/**
 * @route   POST api/auth
 * @desc    User login
 * @access  Public
 */

router.post('/login', async (req, res, next) => {
  const { login, password } = req.body

  // to-do validate fields
  try {
    const user = await User.findOne({ login })

    if (!user || !compareSync(password, user.password)) {
      return next(createError(403, 'Invalid login or password'))
    }

    const tokens = await AuthServise.issueTokens({ user: user.id })
    res.json({
      result: true,
      ...tokens
    })
  } catch (error) {
    return next(createError(500, error.message))
  }
})

router.post('/register', async (req, res, next) => {
  const { login, password } = req.body

  // to-do validate fields
  try {
  const user = await User.findOne({ login })
  if (user) return next(createError(409, 'User alredy exist'))

    const hashedPassword = hashSync(password, 10)

    const newUser = new User({
      login,
      password: hashedPassword
    })
  
    await newUser.save()
  
    res.json({ result: true })
  } catch (error) {
    return next(createError(500, error.message))
  }
})

router.post('/refresh', async (req, res, next) => {
  try {
    const auth_headers = req.headers.authorization
    if (!auth_headers) return next(createError(401, 'not authorized'))

    const jwtoken = auth_headers.split(' ')[1]
    if (!jwtoken) return next(createError(401, 'not authorized'))

    const { refreshToken } = req.body
    if (!refreshToken) return next(createError(401, 'not authorized'))

    const tokens = await AuthServise.refreshToken(refreshToken, jwtoken)
    if (!tokens) return next(createError(400, 'Token is not valid'))
    res.json(tokens)

  } catch (error) {
    return next(createError(500, error.message))
  }
})

router.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return next(createError(401, 'not authorized'))

    const result = await AuthServise.removeToken(refreshToken)
    if (!result) return next(createError(400, 'Token is not valid'))

    res.json({ result: true })
  } catch (error) {
    return next(createError(500, error.message))
  }
})

module.exports = router