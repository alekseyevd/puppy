/* eslint-disable no-unused-vars */
import { useAuth } from './services/auth'
import { useEffect } from 'react'
import styles from './app.css'
import './styles.css'
import LoginPage from './pages/loginPage'
import { Context } from './core/context'
import Button from '@material-ui/core/Button'

const App = () => {
  const {token, login, logout, user, ready} = useAuth()
  // console.log('user', user);

  if (!ready) return <div>looading...</div>

  return (
    <Context.Provider value={{ token, user, login, logout }}>
      { user
        ? <div className={styles.root}>
          <div>
            {JSON.stringify(user)}
            <Button
              onClick={logout}
              variant="contained"
              color="primary"
              size="large">Exit
            </Button>
          </div>
        </div>
        : <LoginPage />
      }
    </Context.Provider>

  )
}

export default App
