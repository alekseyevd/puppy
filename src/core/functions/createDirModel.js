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
    addedBy: {
      type: Types.ObjectId,
      ref: 'User'
    },
    folder: { type: String }
  }

  const props = Object.assign(params, initial)
  const schema = new Schema(props, {
    timestamps: true
  })

  return model(name, schema)
}