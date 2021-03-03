const createHttpError = require('http-errors')

module.exports = (permissions) => {
  return {
    isAllowed: (action) => {
      return (req, res, next) => {
        const role = req.user.role

        if (!permissions[role]) throw createHttpError(403, 'forbidden')

        if (!permissions[role][action]) throw createHttpError(403, 'forbidden')

        if (typeof permissions[role][action] === 'object') {
          req.permissions = permissions[role][action]

          //to-do validate req.query and req.body

          if (action === 'print' && !permissions[role][action].templates.includes(+req.query.template_id))
            throw createHttpError(403, 'forbidden')

          // to do action email
          if (action === 'email' && !permissions[role][action].templates.includes(+req.body.template_id))
            throw createHttpError(403, 'forbidden')
        }
      
        next()
      }
    }
  }
}