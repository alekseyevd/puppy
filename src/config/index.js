const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: `mongodb+srv://dmitrii:${process.env.MONGO_PSW}@cluster0.7v72z.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`,
  JWT_SECRET: 'super secret code',
  JWT_ACC_EXPIRED: 1000 * 60 * 15,
  JWT_REF_EXPIRED: 1000 * 60 * 30
}
