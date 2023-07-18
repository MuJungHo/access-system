import React, { useContext } from "react";
// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { AuthContext } from "../../contexts/AuthContext";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import DetailCard from "./DetailCard";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ConfirmDialog from '../ConfirmDialog';
import {
  Close
} from '@material-ui/icons';

import {
  Checkbox,
  IconButton
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  },
  table: {
    minWidth: 600
  }
}));

export default ({
  childDevices,
  setChildDevices,
  deviceConfig
}) => {
  const classes = useStyles();
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);
  const [selected, setSelected] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [doors, setDoors] = React.useState([])
  const [modal, setModal] = React.useState({
    title: "關聯設備",
    isOpen: false
  });
  const [availableDeviceIdList, setAvailableDeviceIdList] = React.useState([])

  const handleDeleteAccr = async (item) => {
    let newChilds = [...childDevices];
    await authedApi.deleteAccAccr({ id: item.id })
    newChilds = newChilds.filter(child => child.id !== item.id)
    // console.log(childDevices, item.id)
    setChildDevices(newChilds)
  }

  React.useEffect(() => {
    (async () => {
      let { DoorList } = await authedApi.getAccAccrList({ data: { DeviceConfiguration: deviceConfig } })
      DoorList = DoorList.map(door => door.Door[0])
      setDoors(DoorList)
      // console.log(DoorList)
    })()
  }, [])

  React.useEffect(() => {
    (async () => {
      if (modal.isOpen) {
        let availableDeviceIds = await authedApi.getAvailableDeviceIdList({})
        setAvailableDeviceIdList(availableDeviceIds)
      }
      // console.log(DoorList)
    })()
  }, [modal.isOpen])

  // const onSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = doors.map((n) => n.SN);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    const newDoors = doors.filter(door => newSelected.includes(door.SN))
    setSelectedRows(newDoors)
    setSelected(newSelected);
  };

  const handleConfirm = async () => {
    let newChilds = [...childDevices];
    for (let i = 0; i < selectedRows.length; i++) {
      let data = {
        DeviceConfiguration: {
          Category: "ACCR",
          DeviceId: availableDeviceIdList[i],
          Name: selectedRows[i].ModelId,
          ACCDeviceId: deviceConfig.DeviceId,
          DeviceSetting: {
            Brand: "DELTA",
            apb: 0,
            DoorTimeout: 10,
            SensorDI: null,
            LockTimeout: 5000,
            DoorStatus: 1,
            DoorForce: 1,
            Door: [selectedRows[i]]
          }
        }
      }
      // console.log(data)
      await authedApi.addAccAccr({ data })
      newChilds.push({
        deviceid: availableDeviceIdList[i],
        name: selectedRows[i].ModelId,
        config: {
          DeviceConfiguration: data.DeviceConfiguration
        }
      })
    }
    setSelected([])
    setChildDevices(newChilds)
    setModal({
      ...modal,
      isOpen: false
    })
  }

  return (
    <DetailCard onClick={() => setModal({
      ...modal,
      isOpen: true
    })} buttonText="關聯" title="關聯設備" style={{ marginBottom: 20 }}>
      {childDevices.length > 0 && <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {childDevices.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.config.DeviceConfiguration.Category}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.config.DeviceConfiguration.DeviceSetting.Brand}
                </TableCell>
                <TableCell component="th" scope="row">
                  <IconButton onClick={() => handleDeleteAccr(row)}><Close /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
      <ConfirmDialog
        title={modal.title}
        open={modal.isOpen}
        maxWidth="sm"
        onConfirm={handleConfirm}
        onClose={() => setModal({
          ...modal,
          isOpen: false
        })}
      >
        <TableContainer>
          <Table
            className={classes.table}
          // aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  {/* <Checkbox
                    indeterminate={selected.length > 0 && selected.length < doors.length}
                    checked={doors.length > 0 && selected.length === doors.length}
                    onChange={onSelectAllClick}
                  inputProps={{ 'aria-label': 'select all desserts' }}
                  /> */}
                </TableCell>
                <TableCell>SN</TableCell>
                <TableCell>ModelId</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doors.map((row) => {
                const isItemSelected = isSelected(row.SN);
                const childSNs = childDevices.map(child => child.config.DeviceConfiguration.DeviceSetting.Door[0].SN)
                // console.log(childSNs)
                return (
                  <TableRow key={row.SN}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        disabled={childSNs.includes(row.SN)}
                        onChange={(event) => handleClick(event, row.SN)}
                      // inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.SN}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.ModelId}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </ConfirmDialog>
    </DetailCard>
  )
}
