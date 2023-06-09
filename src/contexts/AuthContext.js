import React, { createContext, useState } from "react";
import { api } from '../utils/apis'

const AuthContext = createContext();

function AuthProvider(props) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authedUser, setAuthedUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [authedCustomize, setAuthedCustomize] = useState(JSON.parse(localStorage.getItem('customize')))

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
    authedApi: api(token, logout),
  };

  return <AuthContext.Provider value={value} {...props} />;
}

export { AuthContext, AuthProvider };