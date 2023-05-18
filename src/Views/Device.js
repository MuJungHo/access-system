import React, { useContext } from 'react'
import { useHistory, useParams } from "react-router-dom"

import { makeStyles } from '@material-ui/core/styles';
import { LocaleContext } from "../contexts/LocaleContext";
import { DeviceContext } from "../contexts/DeviceContext";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  Paper,
  IconButton
} from '@material-ui/core'

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
  const { DEVICE } = useContext(DeviceContext);
  const [device, setDevice] = React.useState(DEVICE)
  React.useEffect(() => {
    if ((JSON.stringify(DEVICE) === '{}') && deviceid !== 'create') {
      return history.push('/devices')
    }
  }, [DEVICE, deviceid, history])
  return (
    <div className={classes.root}>
      <IconButton onClick={() => history.push('/devices')}><ArrowBackIcon /></IconButton>
      <Paper className={classes.paper}>
        {device.name}
      </Paper>
    </div>)
}