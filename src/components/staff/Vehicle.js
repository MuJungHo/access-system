import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom"
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { AuthContext } from "../../contexts/AuthContext";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../Select"
import DetailCard from "../DetailCard";
import SimpleTable from "../table/SimpleTable"
import VehicleModalComponent from "./VehicleModalComponent"
import moment from 'moment'
import {
  // Paper,
  // Divider,
  // Button,
  MenuItem
} from '@material-ui/core'

import {
  Close,
  ExitToApp
} from '@material-ui/icons';

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
  const { setSnackBar, showModal, hideModal, showConfirm } = useContext(LayoutContext);
  // const classes = useStyles();
  const { staffid } = useParams();


  React.useEffect(() => {
    (async () => {

    })()
  }, [])

  const handleEditVehicle = (row) => {
    // console.log(row)
    showModal({
      title: "編輯車輛資訊",
      component: <VehicleModalComponent
        vehicle={row}
        onSave={handleSaveVehicle} />
    })
  }

  const handleAddVehicle = () => {
    // console.log(row)
    showModal({
      title: "新增車輛資訊",
      component: <VehicleModalComponent
        vehicle={{}}
        onSave={handleDoAddVehicle} />
    })
  }

  const handleDoAddVehicle = async (state) => {

    const { vehicleidid } = await authedApi.addStaff({
      data: {
        staffid: Number(staffid),
        vin: state.vin,
        rfid: state.rfid,
        starttime: moment(state.starttime).valueOf(),
        endtime: moment(state.endtime).valueOf(),
      }, type: 3
    })

    const newVehicles = [...vehicles, {
      vehicleidid,
      id: vehicleidid,
      enable: 1,
      endtime: moment(state.endtime).valueOf(),
      starttime: moment(state.starttime).valueOf(),
      rfid: state.rfid,
      vin: state.vin,
      starttimeFormat: moment(state.starttime).format('YYYY-MM-DD hh:mm:ss'),
      endtimeFormat: moment(state.endtime).format('YYYY-MM-DD hh:mm:ss'),
    }]
    setVehicles(newVehicles)
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })

  }

  const handleSaveVehicle = async (state) => {

    await authedApi.editStaffVehicle({
      data: {
        ...state,
        starttime: moment(state.starttimeFormat).valueOf(),
        endtime: moment(state.endtimeFormat).valueOf(),
      }, vehicleidid: state.vehicleidid
    })

    const newVehicles = vehicles.map(face => {
      return face.vehicleidid === state.vehicleidid
        ? { ...state } : { ...face }
    })
    setVehicles(newVehicles)
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  const handleDeleteVehicle = (row) => {
    showConfirm({
      title: '刪除車輛資訊',
      component: <h6>{`確認刪除車牌 ${row.vin} 的車輛?`}</h6>,
      onConfirm: () => handleDoDeleteVehicle(row.vehicleidid)
    })
  }

  const handleDoDeleteVehicle = async (vehicleidid) => {
    await authedApi.deleteStaffVehicle({ vehicleidid })
    const newVehicles = vehicles.filter(vehicle => vehicle.vehicleidid !== vehicleidid)
    setVehicles(newVehicles)
    setSnackBar({
      message: "刪除成功",
      isOpen: true,
      severity: "success"
    })
  }

  return (
    <DetailCard
      title="車輛資訊"
      buttonText="新增"
      onClick={handleAddVehicle}
      style={{ marginBottom: 20 }}>
      {vehicles.length > 0 && <SimpleTable
        columns={
          [
            { key: 'vin', label: t('vin') },
            { key: 'rfid', label: 'eTag' },
            { key: 'starttimeFormat', label: t('starttime') },
            { key: 'endtimeFormat', label: t('endtime') },
          ]}
        data={vehicles}
        actions={[
          { name: t('edit'), onClick: (e, row) => handleEditVehicle(row), icon: <ExitToApp /> },
          { name: t('delete'), onClick: (e, row) => handleDeleteVehicle(row), icon: <Close /> },
        ]}
      />}
    </DetailCard>
  )
}