import React, { useContext } from "react";
// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"

import {
  Paper,
  Divider,
  Collapse
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
  children
}) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true)
  // console.log(deviceEditModal)
  return (
    <Paper className={classes.paper} style={{ ...style }}>
      <div style={{ padding: 16, fontSize: 16 }} onClick={() => setOpen(!open)}>{title}</div>
      <Divider />
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </Paper>
  )
}
