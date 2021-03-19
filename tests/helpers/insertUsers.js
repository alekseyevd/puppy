const User = require('../../src/models/User')

module.exports = async () => {
  const users = []

  for (let i = 0; i < 30; i++) {
    users.push({
      login: `user_${i+1}`,
      password: '12345',
      role: 'registered'
    })
  }

  await User.insertMany(users)
}


