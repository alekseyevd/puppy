import schemas from './schemas.json'

class Api {
  constructor(config) {
    this.baseUrl = config.baseUrl
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
      this[entity] = {}
      this[entity].find = async (filter) => {
        try {
          // if (!this.token) throw new Error('invalid token')
          // to-do check permissions
          const data = await this.fetch({
            url: `${this.baseUrl}/${entity}`,
            headers: this.headers,
            data: filter
          })
          if (!data.result) throw new Error(data.message)
          return data
        } catch (error) {
          return error.message
        }
      }
    })
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

    return fetch(url, options).then(r => r.json())
    // return {
    //   _url,
    //   options
    // }
  }
}

const api = new Api({ schemas })

export default api
