const { Router } = require('express')
const router = Router()
const Controller = require('./controller')

router.get('/', Controller.find)
router.get('/:id', Controller.findOne)
// router.post('/', Controller.create)
router.post('/:id', Controller.update)
router.delete('/:id', Controller.deleteOne)

module.exports = router