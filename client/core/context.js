import { createContext } from 'react'

function noop() {}

export const Context = createContext({
  token: null,
  user: null,
  login: noop,
  logout: noop,
})
