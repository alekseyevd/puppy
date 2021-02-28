const { Schema, model, Types } = require('mongoose')
const { v4: uuid } = require('uuid')

const schema = new Schema({
  id: {
    type: String,
    default: uuid,
    unique: true
  }, 
  status: {
    type: Number,
    default: 1
  },
  user_id: {
    type: Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

module.exports = model('Unit', schema)
