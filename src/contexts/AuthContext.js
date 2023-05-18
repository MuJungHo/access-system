import React, { createContext, useState } from "react";
import { api } from '../utils/apis'

const AuthContext = createContext();

function AuthProvider(props) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (jwtToken) => {
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken)
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token')
  };

  const value = {
    token,
    login,
    logout,
    authedApi: api(token, logout),
  };

  return <AuthContext.Provider value={value} {...props} />;
}

export { AuthContext, AuthProvider };