import React, { useContext } from 'react'
import clsx from 'clsx';
import { useHistory, useLocation } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LanguageSharpIcon from '@material-ui/icons/LanguageSharp';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import NotificationsIcon from '@material-ui/icons/Notifications';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import DoneIcon from '@material-ui/icons/Done';
import { palette } from '../../customTheme'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    boxShadow: 'unset',
    backgroundColor: '#f4f6f8',
    // boxShadow: theme.shadows[0],
    zIndex: theme.zIndex.drawer + 1,
    width: `calc(100% - ${73}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    '& .MuiToolbar-root': {
      height: 80
    }
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  paper: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    fontSize: 16,
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  }
}));

const PathComponent = () => {
  const location = useLocation();
  const history = useHistory();
  if (location.pathname === "/device/list") return "設備管理"
  if (location.pathname === "/event") return "事件管理"
  if (location.pathname === "/log") return "系統紀錄"
  if (location.pathname === "/user") return "用戶管理"
  if (location.pathname === "/staff/list") return "人員管理"
  if (location.pathname === "/location") return "位置管理"
  if (location.pathname === "/access") return "存取控制"
  if (location.pathname.includes("/device/device/")) return (<Breadcrumbs aria-label="breadcrumb">
    <Link color="inherit" onClick={e => {
      e.preventDefault();
      history.push("/device/list")

    }}>
      設備管理
    </Link>
    <Link
      color="textPrimary"
    >
      設備詳情
    </Link>
  </Breadcrumbs>)
  return ""
}

const Appbar = ({ open }) => {
  const classes = useStyles();
  const history = useHistory();

  const md5 = require("md5");
  const { logout, token } = useContext(AuthContext);
  const { locale, changeLocale } = useContext(LocaleContext);
  const [wsData, setWsData] = React.useState({})
  const [anchor, setAnchor] = React.useState(null);
  const [eventAnchor, setEventAnchor] = React.useState(null);
  const [events, setEvents] = React.useState([])
  const [eventSnackBar, setEventSnakcBar] = React.useState({
    isOpen: false,
    severity: '',
    message: ''
  })
  const languageMenuOpen = !!anchor;
  const eventMenuOpen = !!eventAnchor;

  const handleChangeLocale = (locale) => {
    changeLocale(locale)
    setAnchor(null)
  }
  const handleClickReadAllEvent = () => {
    const updatedList = events.map(event => ({ ...event, isReaded: 1 }))
    setEvents(updatedList)
  }

  const handleClickEvent = (DateTime) => {
    const updatedList = events.map(event => event.DateTime === DateTime ? { ...event, isReaded: 1 } : { ...event })
    setEvents(updatedList)
  }

  React.useEffect(() => {
    const timestamp = Date.now()
    const sign = md5(timestamp + '#' + token)
    const wsuri = `ws://${process.env.REACT_APP_DOMAIN}/cgi-bin/message?sign=${sign}&timestamp=${timestamp}`
    let ws = new WebSocket(wsuri);
    ws.onopen = () => console.log('event ws opened');
    ws.onclose = () => console.log('event ws closed');
    ws.onmessage = e => {
      const message = JSON.parse(e.data);
      setWsData(message)
    };

    return () => {
      ws.close();
    }
  }, [md5, token])

  React.useEffect(() => {
    if (!eventAnchor) {
      setEvents(prevEvents => {
        var prevEvents_ = [...prevEvents]
        prevEvents_ = prevEvents.filter(event => event.isReaded === 0)
        return prevEvents_
      })
    }
  }, [eventAnchor])

  React.useEffect(() => {
    if (wsData['Event']) {
      setEvents(prevEvents => {
        const prevEvents_ = [...prevEvents]
        // if (wsData['Event'].Level === 3) 
        prevEvents_.push({ ...wsData['Event'], isReaded: 0 })
        return prevEvents_
      })
      setEventSnakcBar({
        isOpen: true,
        severity: {
          1: 'success',
          2: 'warning',
          3: 'error'
        }[wsData['Event'].Level],
        message: wsData['Event'].Description
      })
    }
  }, [wsData])
  // console.log(events)
  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar>
        <Paper className={classes.paper}>
          <PathComponent />
          <div>
            <IconButton onClick={e => setEventAnchor(e.currentTarget)}>
              <Badge overlap="rectangular" badgeContent={events.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={e => setAnchor(e.currentTarget)}>
              <LanguageSharpIcon />
            </IconButton>
            {/* <IconButton>
              <AccountCircleIcon />
            </IconButton> */}
            <IconButton
              onClick={logout}
            >
              <ExitToAppIcon />
            </IconButton>
          </div>
        </Paper>

        <Menu
          open={eventMenuOpen}
          anchorEl={eventAnchor}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          getContentAnchorEl={null}
          onClose={() => setEventAnchor(null)}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingLeft: 8,
              paddingRight: 8,
              minWidth: 250
            }}>
            <Button onClick={() => history.push('/event')}>查看全部</Button>
            <Button onClick={handleClickReadAllEvent}>全部已讀</Button>
          </div>
          <Divider style={{ margin: '8px 0' }} />
          {
            events.length > 0
              ?
              events.map(event => <MenuItem
                key={event.DateTime}
                onClick={() => handleClickEvent(event.DateTime)}>
                {
                  event.isReaded
                    ? <DoneIcon style={{ marginRight: 8 }} />
                    : <FiberManualRecordIcon style={{
                      marginRight: 8,
                      color:
                        {
                          1: palette.secondary.main,
                          2: palette.warning.main,
                          3: palette.error.main
                        }[event.Level]
                    }} />
                }


                {event.Description}
              </MenuItem>)
              : <MenuItem>沒有通知</MenuItem>
          }
        </Menu>
        <Menu
          open={languageMenuOpen}
          anchorEl={anchor}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          getContentAnchorEl={null}
          onClose={() => setAnchor(null)}
        >
          <MenuItem selected={locale === 'en'} onClick={() => handleChangeLocale('en')}>English</MenuItem>
          <MenuItem selected={locale === 'zh-TW'} onClick={() => handleChangeLocale('zh-TW')}>繁體中文</MenuItem>
        </Menu>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={eventSnackBar.isOpen}
          autoHideDuration={3000}
          onClose={() => setEventSnakcBar({
            ...eventSnackBar,
            isOpen: false,
          })}
        >
          <Alert
            elevation={6}
            variant="filled"
            onClose={() => setEventSnakcBar({
              ...eventSnackBar,
              isOpen: false,
            })} severity={eventSnackBar.severity}>
            {eventSnackBar.message}
          </Alert>
        </Snackbar>
      </Toolbar>
    </AppBar>)
}

export default Appbar