import React, { useContext } from "react";
// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
// import Select from "../../components/Select"

import {
  Paper,
  Divider,
  Collapse,
  Button,
  CircularProgress
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 700,
    margin: 'auto'
    // padding: theme.spacing(2)
  }
}));

export default ({
  style,
  title,
  children,
  onClick,
  buttonText = "儲存",
  showButton = true,
  loading = false
}) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true)
  // console.log(deviceEditModal)
  return (
    <Paper className={classes.paper} style={{ ...style }}>
      <div style={{ padding: 16, display: 'flex', alignItems: 'center' }} onClick={() => setOpen(!open)}>
        <span style={{ flex: 1, fontSize: 16 }}>{title}</span>
        {loading && <CircularProgress />}
        {showButton && open && !loading && <Button onClick={e => {
          e.stopPropagation()
          onClick()
        }} variant="contained" color="primary">{buttonText}</Button>}
      </div>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Divider />
        {children}
      </Collapse>
    </Paper>
  )
}
