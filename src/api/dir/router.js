const { Router } = require('express')
const checkAccess = require('../../middleware/checkAccess')
const authorize = require('../../middleware/authorize')
const router = Router()
const Controller = require('./controller')

router.get('/:dir', authorize, checkAccess('find'), Controller.find)
router.get('/:dir/:id', authorize, checkAccess('findOne'), Controller.findOne)

module.exports = router
