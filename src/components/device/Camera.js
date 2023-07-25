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
  // Button,
  MenuItem
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  }
}));

export default ({
  camerabinds,
  setCamerabinds,
  reader_id
}) => {
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);
  const { setSnackBar } = useContext(LayoutContext);
  // const classes = useStyles();

  const [cameras, setCameras] = React.useState([])

  React.useEffect(() => {
    (async () => {
      const { result } = await authedApi.getDeviceList({
        category: "VMSIPC"
        , limit: 10000
        , page: 1
      })
      let options = result.map(c => ({ value: c.id, label: c.name }))
      setCameras(options)

    })()
  }, [])

  const handleSaveCamera = async () => {
    await authedApi.postDeviceBindCamera({ data: { reader_id: Number(reader_id), camera_id: camerabinds } })
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  return (
    <DetailCard onClick={handleSaveCamera} title="相機綁定" style={{ marginBottom: 20 }}>
      <Select
        style={{ margin: 20 }}
        value={camerabinds}
        onChange={(e) => setCamerabinds(e.target.value)}
        multiple
        label={t("camera")}
      >
        {
          cameras
            .map(camera =>
              <MenuItem
                key={camera.value}
                value={camera.value}>
                {camera.label}
              </MenuItem>)
        }
      </Select>
    </DetailCard>
  )
}