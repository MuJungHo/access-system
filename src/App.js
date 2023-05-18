import React from 'react'
import AppRouter from './routers/AppRouter.js'
import theme from './customTheme.js'
import { ThemeProvider } from '@material-ui/styles'
import "./style/normalize.css"
import 'rsuite/dist/styles/rsuite-default.css'

const App = () => (
  <ThemeProvider theme={theme}>
    <AppRouter />
  </ThemeProvider>
)

export default App
