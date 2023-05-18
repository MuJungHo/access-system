import React, { useContext } from 'react'
import clsx from 'clsx';
import { NavLink, useLocation } from "react-router-dom"
import { LocaleContext } from "../../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import routes from '../../routers/routes';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbar: {
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px'
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#1d3654'
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    backgroundColor: '#1d3654'
  },
  node: {
    color: '#ffffff',
    // transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(82, 149, 255, 0.4)'
    },
    '& > div > span': {
      marginLeft: 10,
      fontSize: 16
    },
    '& > *:first-child': {
      height: 32,
      width: 32,
      margin: 'auto'
    },
  },
  nodeActive: {
    backgroundColor: theme.palette.primary.main
  }
}));

const Siderbar = ({ open, setOpen }) => {
  const classes = useStyles();
  const location = useLocation();
  const { t } = useContext(LocaleContext);

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        {open && <img src="../assets/logo.png" style={{ height: 25 }} alt='' />}
        <IconButton edge="end" onClick={() => setOpen(!open)}>
          {open ? <ArrowBackIosIcon color="error" /> : <ArrowForwardIosIcon color="error" />}
        </IconButton>
      </div>
      <List>
        {
          routes.map(route =>
            route.siderlink && <NavLink key={route.path} to={route.path}>
              <ListItem className={clsx(classes.node, {
                [classes.nodeActive]: location.pathname === route.path,
              })}>
                <route.icon />
                {open && <ListItemText primary={t(`sider${route.path}`)} />}
              </ListItem>
            </NavLink>)
        }
      </List>
    </Drawer>)
}

export default Siderbar