import schemas from './schemas.json'

class Api {
  constructor(schemas) {
    // this.schemas = schemas
    Object.keys(schemas).forEach(entity => {
      this[entity] = {
        find: () => console.log(entity)
      }
    })
  }
}

const api = new Api(schemas)

export default api
