import schemas from './schemas.json'

class Api {
  constructor(schemas) {
    // this.schemas = schemas
    Object.keys(schemas).forEach(entity => {
      this[entity] = {
        find: async () => {
          try {
            const response = await fetch(`/api/${entity}`)
            const data = await response.json()
            if (!data.result) throw new Error(data.message)
            return data
          } catch (error) {
            return error.message
          }
        }
      }
    })
  }
}

const api = new Api(schemas)

export default api
