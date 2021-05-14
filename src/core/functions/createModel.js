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
      ref: 'User',
      populate: true
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
          return props[key].ref !== undefined && props[key].populate === true
        })
    return function(next) {
      refs.forEach(ref => {
        this.populate(ref, '-password')
      })
      next()
    }
  }

  schema.pre(/^find/, populate())

  const textSearchfields = Object.keys(props)
      .filter(key => props[key].fastSearch)

  if (textSearchfields.length > 0) {
    schema.index(textSearchfields.reduce((acc, key) => (acc[key] = 'text', acc), {}))

    schema.static('search', function(q) {
      // to-do q.search.split(' ')
      if (q.search) {
        // q.$or = [
        //   { login: new RegExp(q.search, 'i') },
        //   { email: new RegExp(q.search, 'i')}
        // ]
        q.$or = textSearchfields.map(key => ({[key]: new RegExp(q.search, 'i')}))
        delete q.search
      }

      return this.find(q)
    });
  }

  return model(name, schema)
}
