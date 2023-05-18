import React, { useContext } from "react";
import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  textfield: {
    marginTop: theme.spacing(2),
  },
}));

export default ({
  deviceEditModal,
  setDeviceEditModal
}) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  // console.log(deviceEditModal)
  return (
    <React.Fragment>
      <TextField
        className={classes.textfield}
        variant="outlined"
        label={t('name')}
        fullWidth
        value={deviceEditModal.DeviceConfiguration.Name || ''}
        onChange={e => setDeviceEditModal({
          ...deviceEditModal,
          DeviceConfiguration: {
            ...deviceEditModal.DeviceConfiguration,
            Name: e.target.value
          }
        })} />
      <TextField
        className={classes.textfield}
        variant="outlined"
        label={t('ip')}
        fullWidth
        value={deviceEditModal.DeviceConfiguration.DeviceSetting.IPAddress || ''}
        onChange={e => setDeviceEditModal({
          ...deviceEditModal,
          DeviceConfiguration: {
            ...deviceEditModal.DeviceConfiguration,
            DeviceSetting: {
              ...deviceEditModal.DeviceConfiguration.DeviceSetting,
              IPAddress: e.target.value
            }
          }
        })} />
      <TextField
        className={classes.textfield}
        variant="outlined"
        label={t('mac')}
        fullWidth
        value={deviceEditModal.DeviceConfiguration.DeviceSetting.Mac || ''}
        onChange={e => setDeviceEditModal({
          ...deviceEditModal,
          DeviceConfiguration: {
            ...deviceEditModal.DeviceConfiguration,
            DeviceSetting: {
              ...deviceEditModal.DeviceConfiguration.DeviceSetting,
              Mac: e.target.value
            }
          }
        })} />
      <TextField
        className={classes.textfield}
        variant="outlined"
        label={t('http')}
        fullWidth
        value={deviceEditModal.DeviceConfiguration.Ports.Http || ''}
        onChange={e => setDeviceEditModal({
          ...deviceEditModal,
          DeviceConfiguration: {
            ...deviceEditModal.DeviceConfiguration,
            Ports: {
              ...deviceEditModal.DeviceConfiguration.Ports,
              Http: Number(e.target.value)
            }
          }
        })} />
      <TextField
        className={classes.textfield}
        variant="outlined"
        label={t('rtsp')}
        fullWidth
        value={deviceEditModal.DeviceConfiguration.Ports.Rtsp || ''}
        onChange={e => setDeviceEditModal({
          ...deviceEditModal,
          DeviceConfiguration: {
            ...deviceEditModal.DeviceConfiguration,
            Ports: {
              ...deviceEditModal.DeviceConfiguration.Ports,
              Rtsp: Number(e.target.value)
            }
          }
        })} />
      <TextField
        className={classes.textfield}
        variant="outlined"
        label={t('account')}
        fullWidth
        value={deviceEditModal.DeviceConfiguration.Authentication.Account || ''}
        onChange={e => setDeviceEditModal({
          ...deviceEditModal,
          DeviceConfiguration: {
            ...deviceEditModal.DeviceConfiguration,
            Authentication: {
              ...deviceEditModal.DeviceConfiguration.Authentication,
              Account: e.target.value
            }
          }
        })} />
      <TextField
        className={classes.textfield}
        variant="outlined"
        type="password"
        label={t('password')}
        fullWidth
        value={deviceEditModal.DeviceConfiguration.Authentication.Password || ''}
        onChange={e => setDeviceEditModal({
          ...deviceEditModal,
          DeviceConfiguration: {
            ...deviceEditModal.DeviceConfiguration,
            Authentication: {
              ...deviceEditModal.DeviceConfiguration.Authentication,
              Password: e.target.value
            }
          }
        })} />
    </React.Fragment>
  )
}
