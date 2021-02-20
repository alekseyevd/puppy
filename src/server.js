const app = require('./app')
const mongoose = require('mongoose')
const { PORT, MONGO_URI } = require('./config')
//const insertTestUsers = require('../tests/helpers/insertUsers')

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    //await insertTestUsers()

    app.listen(PORT, () => {
      console.log(`Server is started on port ${PORT}`);
    })
  } catch (error) {
    console.log(error.message)
    process.exit()
  }
}

startServer()