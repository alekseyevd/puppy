/* eslint-disable no-unused-vars */
import { useAuth } from './services/auth'
import styles from './app.css'
import './styles.css'
import { Context } from './core/context'
import useRoutes from './routes'

const App = () => {
  const {token, login, logout, user, ready} = useAuth()
  // console.log('user', user);
  const isAuthenticated = !!user

  if (!ready) return <div>looading...</div>

  const routing = useRoutes(isAuthenticated)

  return (
    <Context.Provider value={{ token, user, login, logout }}>
      {routing}
    </Context.Provider>

  )
}

export default App
