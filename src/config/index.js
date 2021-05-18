const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: `mongodb+srv://dmitrii:${process.env.MONGO_PSW}@cluster0.7v72z.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`,
  JWT_SECRET: 'super secret code',
  JWT_ACC_EXPIRED: 60 * 5,
  JWT_REF_EXPIRED: 60 * 30,
  PAGINATION_LIMIT: 30,
  EMAIL_SERVER: process.env.EMAIL_SERVER,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
}
