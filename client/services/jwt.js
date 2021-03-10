export function decode(token) {
  try {
    if (token.split('.').length !== 3 || typeof token !== 'string') throw new Error()

    const payload = token.split('.')[1]
    const base64 = payload.replace('-', '+').replace('_', '/')
    const decoded = JSON.parse(atob(base64))
    return decoded
  } catch (error) {
    return null
  }
}

export function isExpired(token) {
  const decoded = decode(token)

  if (decoded && decoded.exp) {
    return decoded.exp < Date.now() / 1000
  }

  return true
}
