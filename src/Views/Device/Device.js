import React, { useContext } from 'react'
import { useHistory, useParams } from "react-router-dom"

import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  Paper,
  IconButton
} from '@material-ui/core'

import { LocaleContext } from "../../contexts/LocaleContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));
export default () => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useContext(LocaleContext);
  const { deviceid } = useParams()

  return (
    <div className={classes.root}>
      <IconButton onClick={() => history.push('/device/list')}><ArrowBackIcon /></IconButton>
      <Paper className={classes.paper}>
        {deviceid}
      </Paper>
    </div>)
}