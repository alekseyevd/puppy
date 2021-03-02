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

          if (action === 'print' && !permissions[role][action].templates.includes(+req.query.template_id))
            throw createHttpError(403, 'forbidden')

          // to do action email
        }
      
        next()
      }
    }
  }
}