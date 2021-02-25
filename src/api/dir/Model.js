const models = {
  persons: require('../../models/Person')
}

module.exports = (name) => {
  return models[name]
}