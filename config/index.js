const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: `mongodb+srv://dmitrii:${process.env.MONGO_PSW}@cluster0.7v72z.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`
}
