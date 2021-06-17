import schemas from '../../schemas.json'
// import Model from './Model'
// import createActions from './createActions'
import request from './request'
import { login, logout, refresh } from './actions/auth'
import { find, findOne, create, update, deleteOne} from './actions'

class Api {
  constructor(config) {
    this.baseUrl = config.baseUrl || '/api'

    const headers = config.headers || {}
    const authorization = this.token
      ? { Authorization: `Bearer ${this.token}` }
      : {}

    this.headers = {
      ...headers,
      ...authorization
    }

    this.fetch = request.create({
      baseUrl: this.baseUrl,
      headers: this.headers
    })

    // this.schemas = schemas
    // Object.keys(config.schemas).forEach(entity => {
    //   this[entity] = createActions.call(this, entity)
    // })

    const actions = Object.keys(config.schemas).reduce((acc, entity) => {
      acc[entity] = {
        get: () => {
          return {
            find: filter => find.call(this, entity, filter),
            findOne: id => findOne.call(this, entity, id),
            create: data => create.call(this, entity, data),
            update: (id, data) => update.call(this, entity, id, data),
            delete: id => deleteOne.call(this, entity, id)
          }
        }
      }
      return acc
    }, {})

    Object.defineProperties(this, actions);
  }

  get auth() {
    return {
      login: login.bind(this),
      logout: logout.bind(this),
      refresh: refresh.bind(this)
    }
  }

  get token() {
    return this._token
  }

  set token(par) {}
}

const api = new Api({ schemas })

export default api
