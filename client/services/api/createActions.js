export default function CreateActions(entity) {
  const _this = this
  return {
    async find(filter) {
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
    },

    async findOne(id) {
      try {
        const response = await this.fetch({
          url: `${this.baseUrl}/${entity}/${id}`,
          headers: this.headers,
        })
        if (!response.result) throw new Error(response.message)
        return response
      } catch (error) {
        return error.message
      }
    },

    async create(data) {
      try {
        const response = await this.fetch({
          url: `${this.baseUrl}/${entity}`,
          method: 'POST',
          headers: this.headers,
          data
        })
        if (!response.result) throw new Error(response.message)
        return response
      } catch (error) {
        return error.message
      }
    },

    async update(id, data) {
      try {
        const response = await this.fetch({
          url: `${this.baseUrl}/${entity}/${id}`,
          method: 'PUT',
          headers: this.headers,
          data
        })
        if (!response.result) throw new Error(response.message)
        return response
      } catch (error) {
        return error.message
      }
    },

    async delete(id) {
      try {
        const response = await this.fetch({
          url: `${this.baseUrl}/${entity}/${id}`,
          method: 'PUT',
          headers: this.headers,
        })
        if (!response.result) throw new Error(response.message)
        return response
      } catch (error) {
        return error.message
      }
    },
  }
}
