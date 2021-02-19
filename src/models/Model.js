const models = {
  users: require('./User'),
  persons: require('./Person')
}

module.exports = (name) => {
  return models[name]
}