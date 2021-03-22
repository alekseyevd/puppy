/* eslint-disable no-unused-vars */
import AppBar from '@material-ui/core/AppBar'
import { Toolbar, IconButton } from '@material-ui/core'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import MenuIcon from '@material-ui/icons/Menu'
import InputIcon from '@material-ui/icons/Input'
import GroupIcon from '@material-ui/icons/Group';
import styles from './mainLayout.css'
import { useContext } from 'react'
import { Context } from '../../core/context'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Divider from '@material-ui/core/Divider';
import NavItem from './NavItem'

const MainLayout = ({children}) => {
  const {logout} = useContext(Context)
  return (
    <div className={styles.root}>
      <AppBar position="fixed">
        <Toolbar className={styles.topBar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            // onClick={handleDrawerOpen}
            // className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon/>
          </IconButton>
          <IconButton color="inherit" onClick={logout}>
            <InputIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" className={styles.drawer} classes={{paper: styles.drawerPaper}}>
        <Toolbar />
        <div className={styles.drawerContainer}>
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <NavItem text={'Пользователи'} to={'users'}>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
            </NavItem>
            <NavItem text={'Физлица'} to={'people'}>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
            </NavItem>
          </List>
        </div>
      </Drawer>
      <div className={styles.main}>
        <Toolbar />
        {children}
      </div>
    </div>
  )
}

export default MainLayout
