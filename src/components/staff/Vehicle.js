import React, { useContext } from "react";
// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { AuthContext } from "../../contexts/AuthContext";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../Select"
import DetailCard from "../DetailCard";
import SimpleTable from "../table/SimpleTable"
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
  vehicles = [],
  setVehicles
}) => {
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);
  const { setSnackBar } = useContext(LayoutContext);
  // const classes = useStyles();


  React.useEffect(() => {
    (async () => {

    })()
  }, [])

  return (
    <DetailCard
      title="車輛資訊"
      buttonText="新增"
      onClick={() => { }}
      style={{ marginBottom: 20 }}>
      {vehicles.length > 0 && <SimpleTable
        columns={
          [
            { key: 'vin', label: t('vin') },
            { key: 'rfid', label: 'rfid' },
            { key: 'starttime', label: t('starttime') },
            { key: 'endtime', label: t('endtime') },
          ]}
        data={vehicles}
      />}
    </DetailCard>
  )
}