/* eslint-disable no-unused-vars */
import { useAuth } from './services/auth'
import styles from './app.css'
import './styles.css'
import LoginPage from './pages/Login'
import { Context } from './core/context'
import useRoutes from './routes'

const App = () => {
  const {token, login, logout, user, ready} = useAuth()
  // console.log('user', user);
  const isAuthenticated = !!user

  if (!ready) return <div>looading...</div>

  const routing = useRoutes(isAuthenticated, logout)

  return (
    <Context.Provider value={{ token, user, login, logout }}>
      {routing}
      {/* { user
        ? <div className={styles.root}>
          <AppBar position="relative">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                // onClick={handleDrawerOpen}
                // className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
              >
                <MenuIcon/>
              </IconButton>
            </Toolbar>
          </AppBar>
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
      } */}
    </Context.Provider>

  )
}

export default App
