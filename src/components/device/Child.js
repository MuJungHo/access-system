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
  const [childs, setChilds] = React.useState([])
  const [modal, setModal] = React.useState({
    title: "關聯設備",
    isOpen: false
  });
  const [availableDeviceIdList, setAvailableDeviceIdList] = React.useState([])

  // const childSNs = childDevices.map(child => child.config.DeviceConfiguration.DeviceSetting.Door[0].SN)
  const childSNs = []

  const config = {
    "ACC": ["SN", "ModelId"],
    "VMS": ["ModelName", "IPAddress", "Mac", "Stream"],
  }

  const handleDeleteChild = async (item) => {
    let newChilds = [...childDevices];
    if (deviceConfig.Category === "ACC") {
      await authedApi.deleteAccAccr({ id: item.id })
    }
    if (deviceConfig.Category === "VMS") {
      await authedApi.deleteVmsVmsipc({ id: item.id })
    }
    newChilds = newChilds.filter(child => child.id !== item.id)
    // console.log(childDevices, item.id)
    setChildDevices(newChilds)
  }

  React.useEffect(() => {
    (async () => {
      if (deviceConfig.Category === "ACC") {
        let { DoorList } = await authedApi.getAccAccrList({ data: { DeviceConfiguration: deviceConfig } })
        DoorList = DoorList.map(door => door.Door[0])
        DoorList = DoorList.map(door => ({ ...door, key: door.SN }))
        setChilds(DoorList)
      }
      if (deviceConfig.Category === "VMS") {
        let { VMSIPCConfig } = await authedApi.getVmsVmsipcList({ data: { DeviceConfiguration: deviceConfig } })
        VMSIPCConfig = VMSIPCConfig.map(config => ({ ...config, key: config.Mac }))
        setChilds(VMSIPCConfig)
      }
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
    const newDoors = childs.filter(child => newSelected.includes(child.key))
    setSelectedRows(newDoors)
    setSelected(newSelected);
  };

  const handleACConfirm = async () => {
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
      let { id } = await authedApi.addAccAccr({ data })
      newChilds.push({
        id,
        deviceid: availableDeviceIdList[i],
        name: selectedRows[i].ModelId,
        config: {
          DeviceConfiguration: data.DeviceConfiguration
        }
      })
    }
    setChildDevices(newChilds)
  }

  const handleVMSonfirm = async () => {
    let newChilds = [...childDevices];
    for (let i = 0; i < selectedRows.length; i++) {
      let data = {
        DeviceConfiguration: {
          Category: "VMSIPC",
          DeviceId: availableDeviceIdList[i],
          Name: selectedRows[i].ModelName,
          VMSDeviceId: deviceConfig.DeviceId,
          DeviceSetting: {
            Brand: "VIVOTEK",
            CamName: selectedRows[i].CamName,
            IPAddress: selectedRows[i].IPAddress,
            Mac: selectedRows[i].Mac,
            ModelName: selectedRows[i].ModelName,
            Stream: selectedRows[i].Stream,
          }
        }
      }
      // console.log(selectedRows[i])
      // console.log(data)
      let { id } = await authedApi.addVMSIPC({ data })
      newChilds.push({
        id,
        deviceid: availableDeviceIdList[i],
        name: selectedRows[i].ModelName,
        config: {
          DeviceConfiguration: data.DeviceConfiguration
        }
      })
    }
    setChildDevices(newChilds)
  }

  const handleConfirm = () => {
    if (deviceConfig.Category === "ACC") {
      handleACConfirm()
    }
    if (deviceConfig.Category === "VMS") {
      handleVMSonfirm()
    }
    setSelected([])
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
                  <IconButton onClick={() => handleDeleteChild(row)}><Close /></IconButton>
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
                    indeterminate={selected.length > 0 && selected.length < childs.length}
                    checked={childs.length > 0 && selected.length === childs.length}
                    onChange={onSelectAllClick}
                  inputProps={{ 'aria-label': 'select all desserts' }}
                  /> */}
                </TableCell>
                {
                  config[deviceConfig.Category].map(column => <TableCell key={column}>{column}</TableCell>)
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {childs.map((row) => {
                const isItemSelected = isSelected(row.key);

                return (
                  <TableRow key={row.key}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        disabled={childSNs.includes(row.key)}
                        onChange={(event) => handleClick(event, row.key)}
                      // inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    {
                      config[deviceConfig.Category].map(column => <TableCell key={column} component="th" scope="row">
                        {row[column]}
                      </TableCell>)
                    }
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
