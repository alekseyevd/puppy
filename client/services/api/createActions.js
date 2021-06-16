export default function CreateActions(entity) {
  const _this = this
  return {
    async find(filter) {
      try {
        // if (!this.token) throw new Error('invalid token')
        // to-do check permissions
        const response = await _this.fetch({
          url: `/${entity}`,
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
        const response = await _this.fetch({
          url: `/${entity}/${id}`,
        })
        if (!response.result) throw new Error(response.message)
        return response
      } catch (error) {
        return error.message
      }
    },

    async create(data) {
      try {
        const response = await _this.fetch({
          url: `/${entity}`,
          method: 'POST',
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
        const response = await _this.fetch({
          url: `/${entity}/${id}`,
          method: 'PUT',
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
        const response = await _this.fetch({
          url: `/${entity}/${id}`,
        })
        if (!response.result) throw new Error(response.message)
        return response
      } catch (error) {
        return error.message
      }
    },
  }
}
