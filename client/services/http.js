import { useState, useCallback, useContext } from 'react'
import { isExpired } from './jwt'
import { Context } from '../core/context'
import axios from 'axios'

export const useHttp = () => {
  const [isLoading, setLoading] = useState(false)

  const { token, login, logout, refreshToken } = useContext(Context)

  const request = useCallback(async (config) => {
    try {
      setLoading(true)

      let jwtoken = token
      if (jwtoken && isExpired(jwtoken)) {
        try {
          const response = await axios({
            method: 'post',
            url: '/api/auth/refresh',
            data: { refreshToken },
            headers: { Authorization: `Bearer ${jwtoken}`}
          })
          jwtoken = response.data.jwtoken
          login(response.data)
        } catch (error) {
          logout()
          throw error
        }
      }

      const instance = jwtoken
        ? axios.create({
          headers: { Authorization: `Bearer ${jwtoken}` }
        })
        : axios

      const response = await instance(config)
      setLoading(false)
      return response
    } catch (error) {
      setLoading(false)
      throw error
    }
  }, [token, refreshToken])
  return { request, isLoading }
}
