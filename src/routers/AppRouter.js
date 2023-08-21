import React from 'react'
import PrivateRoute from '../routers/PrivateRoute';
import PublicRoute from '../routers/PublicRoute';
import { AuthProvider } from "../contexts/AuthContext";
import { LocaleProvider } from "../contexts/LocaleContext";
import { LayoutProvider } from "../contexts/LayoutContext";
import { Switch, BrowserRouter } from 'react-router-dom'
import Login from "../Views/Login";
import routes from './routes'
import Layout from '../components/layout/Layout';
import { Route, Redirect } from "react-router-dom";

const AppRouter = () => {

  return (
    <LocaleProvider>
      <LayoutProvider>
        <AuthProvider>
          <BrowserRouter>
            <Switch>
              <PublicRoute path="/login">
                <Login />
              </PublicRoute>
              <Layout>
                {
                  routes.map(route =>
                    <PrivateRoute key={route.path} path={route.path} exact={route.exact}>
                      <route.component />
                    </PrivateRoute>)
                }
                <Route exact path="/">
                  <Redirect to="/device/management" />
                </Route>
              </Layout>
            </Switch>
          </BrowserRouter>
        </AuthProvider>
      </LayoutProvider>
    </LocaleProvider>
  )
}
export default AppRouter