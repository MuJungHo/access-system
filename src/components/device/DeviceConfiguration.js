import React, { useContext } from "react";
// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import DetailCard from "./DetailCard";

import {
  Paper,
  Divider,
  Button,
  MenuItem,
  TextField,
  Checkbox
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  },
  info: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    height: 36
  }
}));

export default ({
  deviceConfig
}) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();

  return (
    <DetailCard title="設備資訊" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', padding: 16 }}>
        <div style={{ flex: 1, marginRight: 16 }}>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>設備種類</span>
            <span style={{ flex: 1 }}>{deviceConfig.Category}</span>
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>設備名稱</span>
            <TextField style={{ flex: 1 }} value={deviceConfig?.Name || ""} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>Brand</span>
            <TextField style={{ flex: 1 }} value={deviceConfig?.DeviceSetting?.Brand || ""} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>IPAddress</span>
            <TextField style={{ flex: 1 }} value={deviceConfig?.DeviceSetting?.IPAddress || ""} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>Mac</span>
            <TextField style={{ flex: 1 }} value={deviceConfig?.DeviceSetting?.Mac || ""} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>VCSHost</span>
            <TextField style={{ flex: 1 }} value={deviceConfig?.DeviceSetting?.VCSHost || ""} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>ModelName</span>
            <TextField style={{ flex: 1 }} value={deviceConfig?.DeviceSetting?.ModelName || ""} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>DoorTimeout</span>
            <TextField type="number" style={{ flex: 1 }} value={deviceConfig?.DeviceSetting?.DoorTimeout || ""} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>LockTimeout</span>
            <TextField type="number" style={{ flex: 1 }} value={deviceConfig?.DeviceSetting?.LockTimeout || ""} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>Account</span>
            <TextField style={{ flex: 1 }} value={deviceConfig?.Authentication?.Account || ""} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>Password</span>
            <TextField type="password" style={{ flex: 1 }} value={deviceConfig?.Authentication?.Password || ""} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>Http</span>
            <TextField style={{ flex: 1 }} value={deviceConfig?.Ports?.Http || ""} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>Rtsp</span>
            <TextField style={{ flex: 1 }} value={deviceConfig?.Ports?.Rtsp || ""} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>Port</span>
            <TextField style={{ flex: 1 }} value={deviceConfig?.Ports?.Tcp || ""} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>apb</span>
            <TextField style={{ flex: .5 }} value={deviceConfig?.DeviceSetting?.apb1 || ""} />
            <TextField style={{ flex: .5 }} value={deviceConfig?.DeviceSetting?.apb2 || ""} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>RS485MasterMode</span>
            <Checkbox checked={deviceConfig?.DeviceSetting?.RS485MasterMode === 1} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>DoorForce</span>
            <Checkbox checked={deviceConfig?.DeviceSetting?.DoorForce === 1} />
          </div>
          <div className={classes.info}>
            <span style={{ flex: 1 }}>DoorStatus</span>
            <Checkbox checked={deviceConfig?.DeviceSetting?.DoorStatus === 1} />
          </div>
        </div>
      </div>
    </DetailCard>
  )
}
