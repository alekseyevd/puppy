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
  login: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: true
  },
  phone: {
    type: String,
  },
  person: {
    type: Types.ObjectId,
    ref: 'People',
  },
  role: {
    type: String,
    required: true,
    default: 'admin'
  },
},
{
  timestamps: true
})

schema.index({
  login: 'text',
  email: 'text'
})

schema.static('search', function(q) {
  // to-do q.split(' ')
  if (q.search) {
    q.$or = [
      { login: new RegExp(q.search, 'i') },
      { email: new RegExp(q.search, 'i')}
    ]
    delete q.search
  }

  return this.find(q)
});

module.exports = model('User', schema)
