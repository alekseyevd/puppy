const models = {
  users: require('../../models/User'),
  persons: require('../../models/Person')
}

module.exports = (name) => {
  return models[name]
}