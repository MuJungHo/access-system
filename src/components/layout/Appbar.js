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
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

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
    fontSize: 14,
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
  const { t } = useContext(LocaleContext);
  // console.log(location.pathname)
  if (location.pathname === "/device/management") return t("sider/device/management")
  if (location.pathname === "/event") return t("sider/event")
  if (location.pathname === "/live") return t("sider/live")
  if (location.pathname === "/log") return t("sider/log")
  if (location.pathname === "/user") return t("sider/user")
  if (location.pathname === "/staff/management") return t("sider/staff/management")
  if (location.pathname === "/location/management") return t("sider/location/management")
  if (location.pathname === "/access") return t("sider/access")
  if (location.pathname === "/setting") return t("sider/setting")
  if (location.pathname.includes("/location") && location.pathname.includes("/area-list")) return (<Breadcrumbs aria-label="breadcrumb">
    <Link color="inherit" onClick={e => {
      e.preventDefault();
      history.push("/location/management")
    }}>
      {t("sider/location/management")}
    </Link>
    <Link
      color="textPrimary"
    >
      {t("area-list")}
    </Link>
  </Breadcrumbs>)
  if (location.pathname.includes("/location") && location.pathname.includes("/area/")) {
    let pathname = location.pathname.split("/area")
    return (<Breadcrumbs aria-label="breadcrumb">
      <Link color="inherit" onClick={e => {
        e.preventDefault();
        history.push("/location/management")
      }}>
        {t("sider/location/management")}
      </Link>
      <Link
        color="inherit"
        onClick={e => {
          e.preventDefault();
          history.push(pathname[0] + "/area-list")
        }}
      >
        {t("area-list")}
      </Link>
      <Link
        color="textPrimary"
      >
        {t("area")}
      </Link>
    </Breadcrumbs>)
  }
  if (location.pathname.includes("/location") && location.pathname.includes("/area-status/")) {
    let pathname = location.pathname.split("/area")
    return (<Breadcrumbs aria-label="breadcrumb">
      <Link color="inherit" onClick={e => {
        e.preventDefault();
        history.push("/location/management")
      }}>
        {t("sider/location/management")}
      </Link>
      <Link
        color="inherit"
        onClick={e => {
          e.preventDefault();
          history.push(pathname[0] + "/area-list")
        }}
      >
        {t("area-list")}
      </Link>
      <Link
        color="textPrimary"
      >
        {t("inout")}
      </Link>
    </Breadcrumbs>)
  }
  if (location.pathname.includes("/device/item/")) return (<Breadcrumbs aria-label="breadcrumb">
    <Link color="inherit" onClick={e => {
      e.preventDefault();
      history.push("/device/management")

    }}>
      {t("sider/device/management")}
    </Link>
    <Link
      color="textPrimary"
    >
      {t("detail")}
    </Link>
  </Breadcrumbs>)
  if (location.pathname.includes("/device/card-status/")) return (<Breadcrumbs aria-label="breadcrumb">
    <Link color="inherit" onClick={e => {
      e.preventDefault();
      history.push("/device/management")

    }}>
      {t("sider/device/management")}
    </Link>
    <Link
      color="textPrimary"
    >
      {t("inout")}
    </Link>
  </Breadcrumbs>)
  if (location.pathname.includes("/staff/person/")) return (<Breadcrumbs aria-label="breadcrumb">
    <Link color="inherit" onClick={e => {
      e.preventDefault();
      history.push("/staff/management")
    }}>
      {t("sider/staff/management")}
    </Link>
    <Link
      color="textPrimary"
    >
      {t("detail")}
    </Link>
  </Breadcrumbs>)
  return ""
}

const Appbar = ({ open }) => {
  const classes = useStyles();
  const { logout } = useContext(AuthContext);
  const { locale, changeLocale } = useContext(LocaleContext);
  const [anchor, setAnchor] = React.useState(null);

  const languageMenuOpen = !!anchor;

  const handleChangeLocale = (locale) => {
    changeLocale(locale)
    setAnchor(null)
  }

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
            <IconButton onClick={e => setAnchor(e.currentTarget)}>
              <LanguageSharpIcon />
            </IconButton>
            <IconButton
              onClick={logout}
            >
              <ExitToAppIcon />
            </IconButton>
          </div>
        </Paper>
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
      </Toolbar>
    </AppBar>)
}

export default Appbar