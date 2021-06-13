export default async () => {
  try {
    // if (!this.token) throw new Error('invalid token')
    // to-do check permissions
    const response = await this.fetch({
      url: `${this.baseUrl}/${entity}`,
      headers: this.headers,
      data: filter
    })
    if (!response.result) throw new Error(response.message)
    return response
  } catch (error) {
    return error.message
  }
}
