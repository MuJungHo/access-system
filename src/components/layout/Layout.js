import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Appbar from './Appbar'
import Siderbar from './Siderbar'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    paddingTop: 80,
    backgroundColor: '#f4f6f8',
    height: '100vh'
  }
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  return (
    <div className={classes.root}>
      <Appbar open={open} />
      <Siderbar open={open} setOpen={setOpen} />
      <main style={{ width: "100%", padding: '0 24px', overflow: 'auto' }}>
        {children}
      </main>
    </div>)
}

export default Layout