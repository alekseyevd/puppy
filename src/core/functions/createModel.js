const { Schema, model, Types } = require('mongoose')
const { v4: uuid } = require('uuid')
const toMongooseSchema = require('./toMongooseSchema')

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
      ref: 'users',
      populate: true,
      autopopulate: { maxDepth: 2, select: '-password' }
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

  const props = Object.assign(toMongooseSchema(params), initial)
  const schema = new Schema(props, {
    timestamps: true
  })

  // const populate = () => {
  //   const refs = Object.keys(props)
  //       .filter(key => {
  //         return props[key].ref !== undefined && props[key].populate === true
  //       })
  //   return function(next) {
  //     // refs.forEach(ref => {
  //     //   this.populate(ref, '-password')
  //     // })
  //     this.populate(refs)
  //     next()
  //   }
  // }

  // const pre = populate()
  // schema.pre(['findOne', 'find'], pre)

  schema.plugin(require('mongoose-autopopulate'))
  schema.plugin(require('./mongooseSearchPlugin'))

  return model(name, schema)
}
