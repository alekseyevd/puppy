export default class Model {
  constructor(entity) {
    this.entity = entity
  }

  async find(filter = {}) {
    try {
      // if (!this.token) throw new Error('invalid token')
      // to-do check permissions
      const response = await this.fetch({
        url: `/${this.entity}`,
        data: filter
      })
      if (!response.result) throw new Error(response.message)
      return response
    } catch (error) {
      return error.message
    }
  }
}
