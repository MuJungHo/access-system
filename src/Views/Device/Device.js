import React, { useContext } from 'react'
import { useHistory, useParams } from "react-router-dom"

import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  Paper,
  IconButton
} from '@material-ui/core'

import { LocaleContext } from "../../contexts/LocaleContext";
import DoorControl from '../../components/device/DoorControl';
import Schedule from '../../components/device/Schedule';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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
      {/* {deviceid} */}
      <DoorControl style={{ marginBottom: 20 }} />
      <Schedule />
    </div>)
}