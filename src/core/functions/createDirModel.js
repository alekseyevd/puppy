const { Schema, model, Types } = require('mongoose')
const { v4: uuid } = require('uuid')

module.exports = function (name, params) {
  const initial = {
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
  }

  const props = Object.assign(params, initial)
  const schema = new Schema(props, {
    timestamps: true
  })

  return model(name, schema)
}