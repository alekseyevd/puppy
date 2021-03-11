import { useState, useCallback, useContext } from 'react'
import { isExpired } from './jwt'
import { context } from '../core/context'
import axios from 'axios'
// import axios from 'axios'

export const useHttp = () => {
  const [isLoading, setLoading] = useState(false)

  const { token, login, refreshToken } = useContext(context)

  const request = useCallback(async (config) => {
    setLoading(true)

    const instance = axios.create({
      headers: { Authorization: `Bearer ${token}` }
    })

    instance.post('/api/auth/login')


    // to-do check if token not expired
    // if expired try to update
    // const response = await axios(config)
    // if (isExpired(token)) {
    //   const response = await axios({
    //     method: 'post',
    //     url: '/api/auth/refresh',
    //     data: { refreshToken },
    //     headers: { Authorization: `Bearer ${token}`}
    //   });
    // }



    setLoading(false)
  }, [])
  return { request, isLoading }
}
