import schemas from '../../schemas.json'
// import Model from './Model'
import createActions from './createActions'
import request from './request'

class Api {
  constructor(config) {
    this.baseUrl = config.baseUrl || '/api'
    this.token = config.token

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
    Object.keys(config.schemas).forEach(entity => {
      this[entity] = createActions.call(this, entity)
    })
  }
}

const api = new Api({ schemas })

export default api
