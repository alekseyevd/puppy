/* eslint-disable no-invalid-this */
export async function find(entity, filter) {
  try {
    // to-do check permissions
    const response = await this.fetch({
      url: `/${entity}`,
      data: filter
    })
    if (!response.result) throw new Error(response.message)
    return response
  } catch (error) {
    return error.message
  }
}

export async function findOne(entity, id) {
  try {
    const response = await this.fetch({
      url: `/${entity}/${id}`,
    })
    if (!response.result) throw new Error(response.message)
    return response
  } catch (error) {
    return error.message
  }
}

export async function create(entity, data) {
  try {
    const response = await this.fetch({
      url: `/${entity}`,
      method: 'POST',
      data
    })
    if (!response.result) throw new Error(response.message)
    return response
  } catch (error) {
    return error.message
  }
}

export async function update(entity, id, data) {
  try {
    const response = await this.fetch({
      url: `/${entity}/${id}`,
      method: 'PUT',
      data
    })
    if (!response.result) throw new Error(response.message)
    return response
  } catch (error) {
    return error.message
  }
}

export async function deleteOne(entity, id) {
  try {
    const response = await this.fetch({
      url: `/${entity}/${id}`,
    })
    if (!response.result) throw new Error(response.message)
    return response
  } catch (error) {
    return error.message
  }
}
