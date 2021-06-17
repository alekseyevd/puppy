/* eslint-disable no-invalid-this */
export async function login({ login, password }) {
  try {
    const response = await this.fetch({
      url: '/auth/login',
      method: 'POST',
      data: {
        login, password
      }
    })
    if (!response.result) throw new Error(response.message)
    return response
  } catch (error) {
    return error.message
  }
}

/*
  @PARAMS { refreshToken: XXXXXXX }
*/
export async function logout() {
  try {
    const response = await this.fetch({
      url: '/auth/logout',
      method: 'POST',
      data: {
        refreshToken: this.refreshToken
      }
    })
    if (!response.result) throw new Error(response.message)
    return response
  } catch (error) {
    return error.message
  }
}

export async function refresh() {
  try {
    const response = await this.fetch({
      url: '/auth/refresh',
      method: 'POST',
      data: {
        refreshToken: this.refreshToken
      }
    })
    if (!response.result) throw new Error(response.message)
    return response
  } catch (error) {
    return error.message
  }
}
