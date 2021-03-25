const { Schema, model, Types } = require('mongoose')
const { v4: uuid } = require('uuid')

module.exports = function(type, name, params) {
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
    }
  }

  if (type === 'directories') {
    initial.folder = { type: String }
  }

  if (type === 'documents') {
    initial.owner = {
      type: Types.ObjectId,
      ref: 'owners'
    }

    initial.date = { type: Date }
    initial.number = { type: String }
  }

  const props = Object.assign(params, initial)
  const schema = new Schema(props, {
    timestamps: true
  })

  const populate = () => {
    const refs = Object.keys(props)
        .filter(key => {
          return props[key].ref !== undefined
        })
    return function(next) {
      refs.forEach(ref => {
        this.populate(ref, '-password')
      })
      next()
    }
  }

  schema.pre('find', populate())

  return model(name, schema)
}
