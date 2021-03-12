import { useState, useCallback, useEffect } from 'react'
import { decode, isExpired } from './jwt'
import axios from 'axios'

const LOCAL_STORAGE_JWT_KEY = 'JWT'
const LOCAL_STORAGE_REFRESH_KEY = btoa('refreshToken')

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [refreshToken, setRefreshToken]= useState(null)
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState(null)

  const login = useCallback( ({ jwtoken, refreshToken }) => {
    setToken(jwtoken)
    setRefreshToken(refreshToken)
    const data = decode(jwtoken)
    setUser({
      role: data.role,
      id: data.user_id
    })

    localStorage.setItem(LOCAL_STORAGE_JWT_KEY, jwtoken)
    localStorage.setItem(LOCAL_STORAGE_REFRESH_KEY, refreshToken)
  }, [])

  const logout = useCallback( () => {
    // to-do post to /api/auth/logout
    setToken(null)
    setUser(null)
    setRefreshToken(null)
    localStorage.removeItem(LOCAL_STORAGE_JWT_KEY)
    localStorage.removeItem(LOCAL_STORAGE_REFRESH_KEY)
  }, [])

  useEffect( async () => {
    const jwtoken = localStorage.getItem(LOCAL_STORAGE_JWT_KEY)
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_KEY)

    if (refreshToken && jwtoken) {
      if (isExpired(jwtoken)) {
        // to-do try to refresh
        try {
          const response = await axios({
            method: 'post',
            url: '/api/auth/refresh',
            data: { refreshToken },
            headers: { Authorization: `Bearer ${jwtoken}`}
          })
          console.log('successfully refreshed');
          login(response.data)
        } catch (error) {
          console.log(error)
          // to-do if status !== 500 logout
        }
      } else {
        login({ jwtoken, refreshToken })
      }
    }

    setReady(true)
  }, [login])

  return { login, logout, token, refreshToken, user, ready }
}
