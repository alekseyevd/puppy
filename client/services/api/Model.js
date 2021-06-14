export default class Model {
  constructor(entity, baseUrl, headers) {
    this.entity = entity
  }

  async find(filter = {}) {
    try {
      // if (!this.token) throw new Error('invalid token')
      // to-do check permissions
      const response = await this.fetch({
        url: `${this.baseUrl}/${this.entity}`,
        headers: this.headers,
        data: filter
      })
      if (!response.result) throw new Error(response.message)
      return response
    } catch (error) {
      return error.message
    }
  }
}
