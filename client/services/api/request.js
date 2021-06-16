class Request {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || ''
    this.headers = config.headers || {}
    this.fetch.create = (config = {}) => {
      const instance = new Request(config)
      return instance.fetch
    }
  }

  fetch({ url, method, data, headers }) {
    let _url = this.baseUrl + url

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
      ...this.headers,
      ...headers
    }

    return fetch(_url, options).then(r => r.json())
  }
}

export default new Request().fetch

