const User = require('../../src/core/services/users/Model')
const { hashSync } = require('bcryptjs')

module.exports = async () => {
  // const users = []

  const hashedPassword = hashSync('12345', 10)

  const newUser = new User({
    login: 'user',
    password: hashedPassword,
    role: '60a24156315a1f2f10dbb469'
  })

  await newUser.save()

  // for (let i = 0; i < 30; i++) {
  //   users.push({
  //     login: `user_${i+1}`,
  //     password: hashedPassword,
  //     role: '60a24156315a1f2f10dbb469'
  //   })
  // }

  // await User.insertMany(users)
}


