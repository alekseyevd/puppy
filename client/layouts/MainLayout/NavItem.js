/* eslint-disable no-unused-vars */
import { Button, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core'
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { NavLink } from 'react-router-dom'

const useStyles = makeStyles(() => ({
  item: {
    padding: 0,
  },
  link: {
    display: 'flex',
    width: '100%',
    textTransform: 'none',
    padding: '8px 16px'
  },
  active: {
    color: 'red'
  }
}))

const NavItem = (props) => {
  const styles = useStyles()
  return (
    <ListItem disableGutters className={styles.item}>
      <Button
        component={NavLink}
        to={props.to}
        className={styles.link}
        activeClassName={styles.active}
      >
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary={props.text} />
      </Button>
    </ListItem>
  )
}

export default NavItem
