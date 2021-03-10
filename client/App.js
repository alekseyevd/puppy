import { useAuth } from './services/auth'
import { useEffect } from 'react'
import styles from './app.css'
import './styles.css'
import LoginPage from './pages/loginPage'

const App = () => {
  const {token, login, logout, user, ready} = useAuth()
  console.log('user', user);

  if (!user) {
    return (
      <LoginPage/>
    )
  }

  return (
    <div className={styles.root}>
      Hello World
    </div>
  )
}

export default App