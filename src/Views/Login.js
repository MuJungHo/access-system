import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { LocaleContext } from "../contexts/LocaleContext";
import { Redirect } from "react-router-dom";
import { getKey, tokenlogin } from '../utils/apis';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Card
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    height: '100vh',
    backgroundImage: 'radial-gradient(circle at 48% 33%, #0f72a4, #1d3654 96%)',
    opacity: 0.9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    height: 520,
    width: 420,
    // ['@media (max-width: 450px)']: {
    //   height: 470,
    //   width: 340,
    // },
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '3.5rem 2.1rem 0 2.1rem',

  },
  title: {
    marginBottom: '2rem',
    textAlign: 'center'
  },
  logo: {
    marginBottom: '1.5rem',
    height: 30,
    margin: 'auto',
  },
  submit: {
    height: 50
  },
  spacer: {
    flex: '1 1 auto'
  },
  user: {
    marginBottom: '2.1rem',
    '& svg': {
      width: 17
    },
    '& path': {
      fill: '#bebebe'
    },
    '& .Mui-focused path': {
      fill: '#5295FF'            // focus
    },
    '& .MuiOutlinedInput-input': {
      padding: '17px 14px'
    }
  },
  password: {
    marginBottom: '.5rem',
    '& svg': {
      width: 20
    },
    '& path': {
      fill: '#bebebe'
    },
    '& .Mui-focused path': {
      fill: '#5295FF'            // focus
    },
    '& .MuiOutlinedInput-input': {
      padding: '17px 14px'
    }
  },
  locale: {
    border: '1px solid #bebebe',
    '& .MuiSelect-outlined.MuiSelect-outlined': {
      // height: 40,
      display: 'flex',
      alignItems: 'center',
      // paddingLeft: '3.5rem',
      color: '#bebebe'
    },
    '& .MuiOutlinedInput-input': {
      padding: '17px 14px',
      color: '#bebebe'
    }
  }
}))

const Login = () => {
  const md5 = require("md5");
  const Base64 = require("js-base64").Base64;
  const classes = useStyles();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const { login, token } = useContext(AuthContext);
  const { t, changeLocale, locale } = useContext(LocaleContext);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const timestamp = Date.now();
    const { secretkey } = await getKey({ timestamp });
    const timeAccount = md5(timestamp + "#" + md5(secretkey + "#" + account));
    const timePassword = md5(timestamp + "#" + md5(secretkey + "#" + password));

    var credentials = Base64.encode(timeAccount + ":" + timePassword);

    const { Token, /*name, Roleid, Accountid*/ } = await tokenlogin({ credentials, timestamp })

    login(Token);
  };

  if (token) {
    return <Redirect to="/home" />
  }
  const handleChagneLocale = (e) => {
    changeLocale(e.target.value)
  }
  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <h1 className={classes.title}>{t('welcome')}</h1>
          <img className={classes.logo} src="../assets/logo.png" alt=""/>
          <FormControl className={classes.margin}>
            <TextField
              className={classes.user}
              variant="outlined"
              required
              fullWidth
              value={account}
              onChange={e => setAccount(e.target.value)}
              label="Account"
            // name="accountID"
            // autoComplete="accountID"
            // autoFocus
            // error={vertificationFailed}
            // placeholder={message(locale, 'pleaseEnterThing', message(locale, 'account'))}
            // InputProps={{
            //   startAdornment:
            //     <LoginUser />
            // }}
            />
          </FormControl>
          <FormControl className={classes.margin}>
            <TextField
              className={classes.password}
              variant="outlined"
              required
              fullWidth
              onChange={e => setPassword(e.target.value)}
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
            // error={vertificationFailed}
            // placeholder={message(locale, 'pleaseEnterThing', message(locale, 'password'))}
            // InputProps={{
            //   startAdornment:
            //     <LoginKey />
            // }}
            />
          </FormControl>
          <div style={{ display: 'flex', marginBottom: '1.2rem', justifyContent: 'space-between', alignItems: 'center', color: '#bebebe' }}>
            <FormControlLabel
              value="end"
              control={<Checkbox color="primary" />}
              label="記住我"
              labelPlacement="end"
            />
          </div>
          <FormControl variant="outlined" fullWidth>
            <Select
              className={classes.locale}
              value={locale}
              onChange={handleChagneLocale}
              displayEmpty
            // input={<InputWhite />}
            // IconComponent={Arrow}

            // style={{
            //   backgroundImage: 'url(../assets/locale.svg)',
            //   backgroundPosition: '1rem 50%'
            // }}
            >
              <MenuItem value={'en'}>English</MenuItem>
              <MenuItem value={'zh-TW'}>繁體中文</MenuItem>
            </Select>
          </FormControl>
          <div className={classes.spacer}></div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            style={{ marginBottom: 20 }}
          >
            {t('login')}
          </Button>
          <div className={classes.spacer}></div>
        </form>
      </Card>
    </div>
  );
}

export default Login;