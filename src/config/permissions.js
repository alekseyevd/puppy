module.exports = {
  admin: {
    users: {
      create: true,
      find: true,
      findOne: {
        fields: ['-password']
      },
      update: true,
      delete: true,
      copy: true
    }
  }
}