const express = require('express')
const cors = require('cors')
const config = require('./config')
const mongoose = require('mongoose')

const app = express()

app.use(cors())
app.use(express.json({ extended: true }))

const { PORT, MONGO_URI } = config

app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))

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
