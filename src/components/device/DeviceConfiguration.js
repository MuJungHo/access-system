import React, { useContext } from "react";
import { useParams } from "react-router-dom"

// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { AuthContext } from "../../contexts/AuthContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { makeStyles } from '@material-ui/core/styles';
// import Select from "../../components/Select"
import DetailCard from "./DetailCard";

import {
  // Paper,
  // Divider,
  // Button,
  // MenuItem,
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
    width: 'calc(50% - 16px)',
    alignItems: 'center',
    height: 36,
    margin: 8,
    '& > *': {
      flex: 1
    },
  }
}));

const config = {
  "ACC": ["Brand", "IPAddress", "Mac", "ModelName", "SN", "Tcp"],
  "PMS": ["Brand", "IPAddress", "Mac", "Account", "Password", "Http"],
  "VMS": ["Brand", "IPAddress", "Mac", "Account", "Password", "Http", "Rtsp"],
  "FRS": ["Brand", "IPAddress", "LinkType", "BypassQualityCheck", "Http", "Ws", "Security", "ApiKey", "ApiSecret"],
  "ACR": ["Brand", "IPAddress", "Mac", "DoorTimeout", "LockTimeout", "apb", "RS485MasterMode", "DoorForce", "DoorStatus", "Tcp"],
  "ACCR": ["apb", "DoorTimeout", "LockTimeout", "DoorStatus", "DoorForce"],
  "FRD": ["DoorStatus",],
  "ELEVC": ["Brand", "IPAddress", "Mac", "Tcp", "SN"],
  "ELEVF": [],
  "VMSIPC": [],
  "PMSG": []
}

export default ({
  deviceConfig,
  setDeviceConfig
}) => {
  const classes = useStyles();
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);
  const { setSnakcBar } = useContext(LayoutContext);
  const { deviceid } = useParams();

  const handleSaveDeviceConfiguration = async () => {
    if (deviceConfig.Category === "ACC") {
      await authedApi.editACCDevice({
        data: {
          DeviceConfiguration: deviceConfig,
          SN: deviceConfig.DeviceSetting.SN,
          ModelId: deviceConfig.DeviceSetting.ModelId,
          Tcp: deviceConfig.Ports.Tcp
        }, id: deviceid
      })
    }
    if (deviceConfig.Category === "PMS") {
      await authedApi.editPMSDevice({ data: { DeviceConfiguration: deviceConfig }, id: deviceid })
    }
    if (deviceConfig.Category === "VMS") {
      await authedApi.editVMSDevice({ data: { DeviceConfiguration: deviceConfig }, id: deviceid })
    }
    if (deviceConfig.Category === "FRS") {
      await authedApi.editFRSDevice({ data: { DeviceConfiguration: deviceConfig }, id: deviceid })
    }
    if (deviceConfig.Category === "ACR") {
      await authedApi.editACRDevice({ data: { DeviceConfiguration: deviceConfig }, id: deviceid })
    }
    if (deviceConfig.Category === "ACCR") {
      await authedApi.editACCRDevice({ data: { DeviceConfiguration: deviceConfig }, id: deviceid })
    }
    if (deviceConfig.Category === "FRD") {
      await authedApi.editFRDDevice({ data: { DeviceConfiguration: deviceConfig }, id: deviceid })
    }
    if (deviceConfig.Category === "ELEVC") {
      await authedApi.editELEVCDevice({ data: { DeviceConfiguration: deviceConfig }, id: deviceid })
    }
    if (deviceConfig.Category === "ELEVF") {
      await authedApi.editELEVFDevice({ data: { DeviceConfiguration: deviceConfig }, id: deviceid })
    }
    if (deviceConfig.Category === "VMSIPC") {
      await authedApi.editVMSIPCDevice({ data: { DeviceConfiguration: deviceConfig }, id: deviceid })
    }
    if (deviceConfig.Category === "PMSG") {
      await authedApi.editPMSGDevice({ data: { DeviceConfiguration: deviceConfig }, id: deviceid })
    }
    setSnakcBar({
      message: t('saveSucceed'),
      isOpen: true,
      severity: "success"
    })
  }

  return (
    <DetailCard
      title="設備資訊"
      style={{ marginBottom: 20 }}
      buttonText="儲存"
      onClick={handleSaveDeviceConfiguration}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', padding: 8 }}>
        <div className={classes.info}>
          <span>{t("category")}</span>
          <span>{deviceConfig.Category}</span>
        </div>
        <div className={classes.info}>
          <span>{t("name")}</span>
          <TextField
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              Name: e.target.value
            })}
            value={deviceConfig?.Name || ""} />
        </div>

        {/* DeviceSetting */}
        {config[deviceConfig.Category]?.includes("Mac") && <div className={classes.info}>
          <span>Mac</span>
          <TextField
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              DeviceSetting: {
                ...deviceConfig.DeviceSetting,
                Mac: e.target.value
              }
            })}
            value={deviceConfig?.DeviceSetting?.Mac || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("Brand") && <div className={classes.info}>
          <span>{t("brand")}</span>
          <TextField
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              DeviceSetting: {
                ...deviceConfig.DeviceSetting,
                Brand: e.target.value
              }
            })}
            value={deviceConfig?.DeviceSetting?.Brand || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("SN") && <div className={classes.info}>
          <span>SN</span>
          <TextField
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              DeviceSetting: {
                ...deviceConfig.DeviceSetting,
                SN: e.target.value
              }
            })}
            value={deviceConfig?.DeviceSetting?.SN || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("ModelName") && <div className={classes.info}>
          <span>ModelName</span>
          <TextField
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              DeviceSetting: {
                ...deviceConfig.DeviceSetting,
                ModelName: e.target.value
              }
            })}
            value={deviceConfig?.DeviceSetting?.ModelName || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("IPAddress") && <div className={classes.info}>
          <span>IP</span>
          <TextField
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              DeviceSetting: {
                ...deviceConfig.DeviceSetting,
                IPAddress: e.target.value
              }
            })}
            value={deviceConfig?.DeviceSetting?.IPAddress || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("VCSHost") && <div className={classes.info}>
          <span>VCSHost</span>
          <TextField
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              DeviceSetting: {
                ...deviceConfig.DeviceSetting,
                VCSHost: e.target.value
              }
            })}
            value={deviceConfig?.DeviceSetting?.VCSHost || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("DoorTimeout") && <div className={classes.info}>
          <span>{t("doorTimeout")}</span>
          <TextField
            type="number"
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              DeviceSetting: {
                ...deviceConfig.DeviceSetting,
                DoorTimeout: e.target.value
              }
            })}
            value={deviceConfig?.DeviceSetting?.DoorTimeout || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("LockTimeout") && <div className={classes.info}>
          <span>{t("lockTimeout")}</span>
          <TextField
            type="number"
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              DeviceSetting: {
                ...deviceConfig.DeviceSetting,
                LockTimeout: e.target.value
              }
            })}
            value={deviceConfig?.DeviceSetting?.LockTimeout || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("apb") && <div className={classes.info}>
          <span>{t("apb")}</span>
          <TextField
            style={{ flex: .5, marginRight: 10 }}
            type="number"
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              DeviceSetting: {
                ...deviceConfig.DeviceSetting,
                apb1: e.target.value,
                apb: Number(e.target.value + (deviceConfig?.DeviceSetting?.apb2 || ""))
              }
            })}
            value={deviceConfig?.DeviceSetting?.apb1 || ""} />
          <TextField
            style={{ flex: .5 }}
            type="number"
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              DeviceSetting: {
                ...deviceConfig.DeviceSetting,
                apb2: e.target.value,
                apb: Number((deviceConfig?.DeviceSetting?.apb1 || "") + e.target.value)
              }
            })}
            value={deviceConfig?.DeviceSetting?.apb2 || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("RS485MasterMode") && <div className={classes.info}>
          <span>{t("rS485MasterMode")}</span>
          <div>
            <Checkbox
              color="primary"
              onChange={e => setDeviceConfig({
                ...deviceConfig,
                DeviceSetting: {
                  ...deviceConfig.DeviceSetting,
                  RS485MasterMode: e.target.checked ? 1 : 0
                }
              })} checked={deviceConfig?.DeviceSetting?.RS485MasterMode === 1} />
          </div>
        </div>}
        {config[deviceConfig.Category]?.includes("DoorForce") && <div className={classes.info}>
          <span>{t("doorForce")}</span>
          <div>
            <Checkbox
              color="primary"
              onChange={e => setDeviceConfig({
                ...deviceConfig,
                DeviceSetting: {
                  ...deviceConfig.DeviceSetting,
                  DoorForce: e.target.checked ? 1 : 0
                }
              })} checked={deviceConfig?.DeviceSetting?.DoorForce === 1} />
          </div>
        </div>}
        {config[deviceConfig.Category]?.includes("DoorStatus") && <div className={classes.info}>
          <span>{t("doorStatus")}</span>
          <div>
            <Checkbox
              color="primary"
              onChange={e => setDeviceConfig({
                ...deviceConfig,
                DeviceSetting: {
                  ...deviceConfig.DeviceSetting,
                  DoorStatus: e.target.checked ? 1 : 0
                }
              })} checked={deviceConfig?.DeviceSetting?.DoorStatus === 1} />
          </div>
        </div>}
        {config[deviceConfig.Category]?.includes("BypassQualityCheck") && <div className={classes.info}>
          <span>BypassQualityCheck</span>
          <div>
            <Checkbox
              color="primary"
              onChange={e => setDeviceConfig({
                ...deviceConfig,
                DeviceSetting: {
                  ...deviceConfig.DeviceSetting,
                  BypassQualityCheck: e.target.checked ? 1 : 0
                }
              })} checked={deviceConfig?.DeviceSetting?.BypassQualityCheck === 1} />
          </div>
        </div>}
        {config[deviceConfig.Category]?.includes("LinkType") && <div className={classes.info}>
          <span>LinkType</span>
          <span>{deviceConfig?.DeviceSetting?.LinkType}</span>
        </div>}
        {/* DeviceSetting */}

        {/* Authentication */}
        {config[deviceConfig.Category]?.includes("ApiKey") && <div className={classes.info}>
          <span>ApiKey</span>
          <TextField
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              Authentication: {
                ...deviceConfig.Authentication,
                ApiKey: e.target.value
              }
            })}
            value={deviceConfig?.Authentication?.ApiKey || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("ApiSecret") && <div className={classes.info}>
          <span>ApiSecret</span>
          <TextField
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              Authentication: {
                ...deviceConfig.Authentication,
                ApiSecret: e.target.value
              }
            })}
            value={deviceConfig?.Authentication?.ApiSecret || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("Account") && <div className={classes.info}>
          <span>{t("account")}</span>
          <TextField
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              Authentication: {
                ...deviceConfig.Authentication,
                Account: e.target.value
              }
            })}
            value={deviceConfig?.Authentication?.Account || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("Password") && <div className={classes.info}>
          <span>{t("password")}</span>
          <TextField
            type="password"
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              Authentication: {
                ...deviceConfig.Authentication,
                Password: e.target.value
              }
            })}
            value={deviceConfig?.Authentication?.Password || ""} />
        </div>}
        {/* Authentication */}

        {/* Ports */}
        {config[deviceConfig.Category]?.includes("Http") && <div className={classes.info}>
          <span>Http</span>
          <TextField
            type="number"
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              Ports: {
                ...deviceConfig.Ports,
                Http: Number(e.target.value)
              }
            })}
            value={deviceConfig?.Ports?.Http || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("Rtsp") && <div className={classes.info}>
          <span>Rtsp</span>
          <TextField
            type="number"
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              Ports: {
                ...deviceConfig.Ports,
                Rtsp: Number(e.target.value)
              }
            })}
            value={deviceConfig?.Ports?.Rtsp || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("Tcp") && <div className={classes.info}>
          <span>Port</span>
          <TextField
            type="number"
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              Ports: {
                ...deviceConfig.Ports,
                Tcp: Number(e.target.value)
              }
            })}
            value={deviceConfig?.Ports?.Tcp || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("Ws") && <div className={classes.info}>
          <span>Ws</span>
          <TextField
            type="number"
            onChange={e => setDeviceConfig({
              ...deviceConfig,
              Ports: {
                ...deviceConfig.Ports,
                Ws: Number(e.target.value)
              }
            })}
            value={deviceConfig?.Ports?.Ws || ""} />
        </div>}
        {config[deviceConfig.Category]?.includes("Security") && <div className={classes.info}>
          <span>SSL</span>
          <div>
            <Checkbox
              color="primary"
              onChange={e => setDeviceConfig({
                ...deviceConfig,
                Ports: {
                  ...deviceConfig.Ports,
                  Security: e.target.checked
                }
              })} checked={deviceConfig?.Ports?.Security} />
          </div>
        </div>}
        {/* Ports */}
      </div>
    </DetailCard >
  )
}
