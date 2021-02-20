module.exports = {
  admin: {
    users: {
      create: {
        fields: []
      },
      find: true,
      findOne: {
        fields: ['-password']
      },
      update: {
        own: true,
        fields: []
      },
      delete: {
        own: true,
        fields: []
      },
      count: true
    }
  }
}