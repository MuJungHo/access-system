import React from 'react'
import PrivateRoute from '../routers/PrivateRoute';
import PublicRoute from '../routers/PublicRoute';
import { AuthProvider } from "../contexts/AuthContext";
import { LocaleProvider } from "../contexts/LocaleContext";
import { Switch, BrowserRouter } from 'react-router-dom'
import Login from "../Views/Login";
import routes from './routes'
import Layout from '../components/layout/Layout';

const AppRouter = () => {

  return (
    <AuthProvider>
      <LocaleProvider>
        <BrowserRouter>
          <Switch>
            <PublicRoute path="/login">
              <Login />
            </PublicRoute>
            <Layout>
              {
                routes.map(route =>
                  <PrivateRoute key={route.path} path={route.path}>
                    <route.component />
                  </PrivateRoute>)
              }
            </Layout>
          </Switch>
        </BrowserRouter>
      </LocaleProvider>
    </AuthProvider>
  )
}
export default AppRouter