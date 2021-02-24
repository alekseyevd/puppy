const { Router } = require('express')
const checkAccess = require('../../middleware/checkAccess')
// const authorize = require('../../middleware/authorize')
const router = Router()
const Controller = require('./controller')

router.get('/:dir', checkAccess('find'), Controller.find)
router.get('/:dir/:id', checkAccess('findOne'), Controller.findOne)
router.post('/:dir', checkAccess('create'), Controller.create)
router.post('/:dir/:id', checkAccess('update'), Controller.update)
router.delete('/:dir/:id', checkAccess('delete'), Controller.deleteOne)


module.exports = router
