import schemas from '../../schemas.json'
// import Model from './Model'
// import createActions from './createActions'
import Model from './Model'

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

    // this.schemas = schemas
    Object.keys(config.schemas).forEach(entity => {
      // this[entity] = createActions.call(this, entity)
      this[entity] = new Model(entity)
    })
  }

  createActions(entity) {
    const _this = this
    return {
      async find(filter = {}) {
        try {
          // if (!this.token) throw new Error('invalid token')
          // to-do check permissions
          const response = await _this.fetch({
            url: `${_this.baseUrl}/${entity}`,
            headers: _this.headers,
            data: filter
          })
          if (!response.result) throw new Error(response.message)
          return response
        } catch (error) {
          return error.message
        }
      }
    }
  }

  fetch({ url, method, data, headers }) {
    let _url = url

    const options = {
      method: method || 'GET'
    }

    if (method === 'POST' || method === 'PUT') options.body = JSON.stringify(data)

    if (options.method === 'GET' && data) {
      const getParams = Object.keys(data)
          .map(key => {
            const value = data[key]
            switch (typeof value) {
              case 'string':
              case 'number':
              case 'boolean':
                return `${key}=${value}`

              case 'object':
                if (Array.isArray(value)) {
                  return value.map(v => `${key}[]=${v}`).join('&')
                }
            }
          })
          .join('&')
      const delimeter = _url.includes('?') ? '' : '?'
      _url += `${delimeter}${getParams}`
    }

    options.headers = {
      'Content-Type': 'application/json',
      ...headers
    }

    return fetch(_url, options).then(r => r.json())
    // return {
    //   _url,
    //   options
    // }
  }
}

const api = new Api({ schemas })

export default api
