module.exports = {
  admin: {
    users: {
      create: true,
      find: true,
      findOne: {
        fields: ['-password']
      },
      update: {
        own: true,
      },
      delete: {
        own: true,
        fields: []
      },
      count: true
    }
  }
}