const { Router } = require('express')
const checkAccess = require('../../middleware/checkAccess')
const authorize = require('../../middleware/authorize')
const router = Router()

router.get('/:dir', authorize, checkAccess('find'), async (req, res) => {
  const filter = JSON.parse(req.query.filter)
  console.log(filter);

  try {

    const Model = require(`../../models/${req.params.dir}`)
    
    // to-do add query params to filter
    if (req.permissions && req.permissions.own) {
      filter.owner =  req.user.id
    }

    let selection = []
    if (req.permissions && req.permissions.fields && Array.isArray(req.permissions.fields)) {
      selection = req.permissions.fields
    }

    let users = await Model.find(filter).select(selection)
    res.json(users)
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message})
  }
})

module.exports = router
