import React, { useContext } from "react";
// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { AuthContext } from "../../contexts/AuthContext";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import DetailCard from "./DetailCard";
import {
  // Paper,
  // Divider,
  Button,
  MenuItem
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  }
}));

const mins = ["100", "300", "500", "1000", "3000", "5000"]


export default ({
  id
}) => {
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);
  const { setSnackBar } = useContext(LayoutContext);
  const [minutes, setMinutes] = React.useState()
  // console.log(deviceEditModal)
  const handleOpenDoorOnce = async () => {
    await authedApi.putDeviceOpenDoor({ data: { ids: [Number(id)] }, time: minutes })
    setSnackBar({
      message: "發送成功",
      isOpen: true,
      severity: "success"
    })
  }
  const handleOffLock = async () => {
    await authedApi.putDeviceOpenDoor({ data: { ids: [Number(id)] }, action: 'remote_open' })
    setSnackBar({
      message: "發送成功",
      isOpen: true,
      severity: "success"
    })
  }
  const handleOnLock = async () => {
    await authedApi.putDeviceOpenDoor({ data: { ids: [Number(id)] }, action: 'remote_close' })
    setSnackBar({
      message: "發送成功",
      isOpen: true,
      severity: "success"
    })
  }
  return (
    <DetailCard showButton={false} title="遠距開門" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', padding: 16 }}>
        <div style={{ flex: 1 }}>
          <span>單次開門</span>
          <Select
            style={{ marginLeft: 20 }}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            label={"分鐘"}
          >
            {
              mins
                .map(min =>
                  <MenuItem
                    key={min}
                    value={min}>
                    {min}
                  </MenuItem>)
            }
          </Select>
          <Button
            onClick={handleOpenDoorOnce}
            style={{ marginLeft: 20 }} color="primary" variant="outlined">解鎖</Button>
        </div>
        <div style={{ flex: 1 }}>
          <span>持續開門</span>
          <Button
            onClick={handleOffLock}
            style={{ marginLeft: 20 }} color="primary" variant="outlined">解鎖</Button>
          <Button
            onClick={handleOnLock}
            style={{ marginLeft: 20 }} color="primary" variant="outlined">上鎖</Button>
        </div>
      </div>
    </DetailCard>
  )
}
