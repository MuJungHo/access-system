import React, { createContext, useState, useContext } from "react";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { api } from '../utils/apis'
import { LocaleContext } from "./LocaleContext";


const AuthContext = createContext();


function AuthProvider({ children }) {
  const { t } = useContext(LocaleContext);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authedUser, setAuthedUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [authedCustomize, setAuthedCustomize] = useState(JSON.parse(localStorage.getItem('customize')))
  const [snackBar, setSnakcBar] = useState({
    isOpen: false,
    severity: 'info',
    message: ''
  })

  const login = async (jwtToken, accountid) => {
    const [accountInfo] = await api(jwtToken, logout).getAccountById({ accountid })
    const customize = accountInfo.customize || "{}"
    const jsonCustomize = JSON.parse(customize)
    setToken(jwtToken);
    setAuthedUser(accountInfo)
    setAuthedCustomize(jsonCustomize)
    localStorage.setItem('token', jwtToken)
    localStorage.setItem('customize', JSON.stringify(jsonCustomize))
    localStorage.setItem('user', JSON.stringify({ ...accountInfo }))
  };

  const logout = () => {
    setToken(null);
    setAuthedUser(null);
    setAuthedCustomize(null);
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('customize')
  };

  const editAuthedUserCustomize = async (customize) => {
    const customize_ = JSON.stringify(customize)
    await api(token, logout).editAccountCustomizeById({
      data: {
        accountid: authedUser.accountid,
        customize: customize_
      },
    })
    setAuthedCustomize(customize)
    localStorage.setItem('customize', customize_)
  }

  const value = {
    token,
    login,
    logout,
    authedUser,
    authedCustomize,
    editAuthedUserCustomize,
    setSnakcBar,
    authedApi: api(token, logout, setSnakcBar, t),
  };

  return <AuthContext.Provider
    value={value}>
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={snackBar.isOpen}
      autoHideDuration={3000}
      onClose={() => setSnakcBar({
        isOpen: false,
        severity: 'info',
        message: ''
      })}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={() => setSnakcBar({
          isOpen: false,
          severity: 'info',
          message: ''
        })} severity={snackBar.severity}>
        {snackBar.message}
      </Alert>
    </Snackbar>
    {children}
  </AuthContext.Provider>;
}

export { AuthContext, AuthProvider };