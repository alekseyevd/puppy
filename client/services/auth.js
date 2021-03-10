import { useState, useCallback, useEffect } from 'react'
import { decode, isExpired } from './jwt'

const LOCAL_STORAGE_KEY = 'JWT'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState(null)

  const login = useCallback( (token) => {
    setToken(token)
    const data = decode(token)
    setUser({
      role: data.role,
      id: data.user_id
    })

    localStorage.setItem(LOCAL_STORAGE_KEY, token)
  }, [])

  const logout = useCallback( () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }, [])

  useEffect( () => {
    const jwtoken = localStorage.getItem(LOCAL_STORAGE_KEY)

    const data = decode(jwtoken)
    const expired = isExpired(jwtoken)

    if (data && !expired) {
      login(jwtoken)
    }

    setReady(true)
  }, [])

  return { login, logout, token, user, ready }
}
