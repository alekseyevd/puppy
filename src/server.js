const app = require('./app')
const mongoose = require('mongoose')
const { PORT, MONGO_URI } = require('./config')

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(PORT, () => {
      console.log(`Server is started on port ${PORT}`);
    })
  } catch (error) {
    console.log(error.message)
    process.exit()
  }
}

startServer()