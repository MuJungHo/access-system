import React, { createContext, useState, useContext } from "react";
import { api } from '../utils/apis'
import { LocaleContext } from "./LocaleContext";
import { LayoutContext } from "./LayoutContext";


const AuthContext = createContext();


function AuthProvider(props) {
  const { t } = useContext(LocaleContext);
  const { setSnackBar } = useContext(LayoutContext);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authedUser, setAuthedUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [authedCustomize, setAuthedCustomize] = useState(JSON.parse(localStorage.getItem('customize')))

  const login = async (jwtToken, accountid, keep) => {
    const [accountInfo] = await api(jwtToken, logout).getAccountById({ accountid })
    const customize = accountInfo.customize || "{}"
    const jsonCustomize = JSON.parse(customize)
    
    setToken(jwtToken);
    setAuthedUser(accountInfo)
    setAuthedCustomize(jsonCustomize)

    if (keep) {
      localStorage.setItem('token', jwtToken)
      localStorage.setItem('customize', JSON.stringify(jsonCustomize))
      localStorage.setItem('name', accountInfo.name)
    }
  };

  const logout = () => {
    setToken(null);
    setAuthedUser(null);
    setAuthedCustomize(null);
    localStorage.clear()
    // localStorage.removeItem('token')
    // localStorage.removeItem('name')
    // localStorage.removeItem('customize')
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
    authedApi: api(token, logout, setSnackBar, t),
  };

  return <AuthContext.Provider value={value} {...props} />;
}

export { AuthContext, AuthProvider };