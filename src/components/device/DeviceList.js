import React, { useContext } from "react";
import { useHistory } from "react-router-dom"
// import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import {
  BorderColorSharp,
  FiberManualRecord,
  Close,
  MeetingRoom
} from '@material-ui/icons';

import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Table from "../../components/table/Table";
import Select from '../../components/Select';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//   },
//   paper: {
//     width: '100%',
//     borderTopLeftRadius: 0,
//     borderTopRightRadius: 0,
//     // marginTop: theme.spacing(2),
//     marginBottom: theme.spacing(2),
//   },
//   table: {
//     minWidth: 750,
//   },
//   visuallyHidden: {
//     border: 0,
//     clip: 'rect(0 0 0 0)',
//     height: 1,
//     margin: -1,
//     overflow: 'hidden',
//     padding: 0,
//     position: 'absolute',
//     top: 20,
//     width: 1,
//   },
// }));

const categories = ["PMS", "VMS", "VMSIPC", "ACR", "ACC", "ACCR", "FRS", "FRD", "FRAD", "ELEVC", "ELEVE"];

export default function Devices() {
  // const classes = useStyles();
  const md5 = require("md5");
  const history = useHistory();

  const { t } = useContext(LocaleContext);
  const { authedApi, token } = useContext(AuthContext);
  
  const [wsData, setWsData] = React.useState({});
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    order: 'asc',
    orderBy: '',
    page: 0,
    limit: 5,
    category: "",
    locationid: "",
    groupid: ""
  });
  const [devices, setDevices] = React.useState([])
  const [locations, setLocations] = React.useState([])
  const [groups, setGroups] = React.useState([])
  


  React.useEffect(() => {
    (async () => {
      const { result: locationList } = await authedApi.getLocationList({ limit: 50, page: 1 })
      const { result: groupList } = await authedApi.getDevcieGroupList({ limit: 50, page: 1 })
      setLocations(locationList)
      setGroups(groupList)
    })()
  }, [])

  React.useEffect(() => {
    (async () => {
      const { result, total } = await authedApi.getDeviceList({ ...filter, page: filter.page + 1 })

      const tableData = result.map(data => ({
        ...data,
        id: data.id,
        ip: data.config.DeviceConfiguration.DeviceSetting.IPAddress,
        status: <FiberManualRecord color="error" />
      }))
      setTotal(total)
      setDevices(tableData)

    })();
  }, [authedApi, filter, setDevices])

  React.useEffect(() => {
    const timestamp = Date.now()
    const sign = md5(timestamp + '#' + token)
    const wsuri = `ws://${process.env.REACT_APP_DOMAIN}/cgi-bin/message?sign=${sign}&timestamp=${timestamp}`
    let ws = new WebSocket(wsuri);
    ws.onopen = () => console.log('device ws opened');
    ws.onclose = () => console.log('device ws closed');

    ws.onmessage = e => {
      const message = JSON.parse(e.data);
      setWsData(message)
    };

    return () => {
      ws.close();
    }
  }, [md5, token])

  React.useEffect(() => {
    if (wsData['DeviceStatus']) {
      setDevices(prevRows => prevRows.map(row => {
        const device = wsData['DeviceStatus'].find(ws => ws.DeviceID === row.deviceid) || {}
        const status = device.Status
        return {
          ...row,
          status: <FiberManualRecord color={status === 'off' ? 'error' : 'secondary'} />
        }
      }))
    }
  }, [wsData, setDevices])
  
  const handleEditDeviceOpen = (e, device) => {
    e.stopPropagation()
    history.push(`/device/item/${device.id}`)
  }

  const handleActionShow = device => device.category === "ACR" || device.category === "ACCR"

  return (
    <React.Fragment>
      <Table
        tableKey="DEVICE_LIST"
        data={devices}
        maxHeight="calc(100vh - 275px)"
        total={total}
        filter={filter}
        setFilter={setFilter}
        filterComponent={
          <React.Fragment>
            <Select
              style={{ marginLeft: 20 }}
              value={filter.category}
              onChange={(e) => setFilter({
                ...filter,
                category: e.target.value
              })}
              label={t("category")}
            >
              {
                categories
                  .map(category =>
                    <MenuItem
                      key={category}
                      value={category}>
                      {category}
                    </MenuItem>)
              }
            </Select>
            <Select
              style={{ marginLeft: 20 }}
              value={filter.locationid}
              onChange={(e) => setFilter({
                ...filter,
                locationid: e.target.value
              })}
              label={t("location")}
            >
              {
                locations
                  .map(location =>
                    <MenuItem
                      key={location.locationid}
                      value={location.locationid}>
                      {location.name}
                    </MenuItem>)
              }
            </Select>
            <Select
              style={{ marginLeft: 20 }}
              value={filter.groupid}
              onChange={(e) => setFilter({
                ...filter,
                groupid: e.target.value
              })}
              label={t("group")}
            >
              {
                groups
                  .map(group =>
                    <MenuItem
                      key={group.groupid}
                      value={group.groupid}>
                      {group.name}
                    </MenuItem>)
              }
            </Select>
            <Button
              style={{ marginLeft: 20 }}
              onClick={() => setFilter({
                ...filter,
                groupid: "",
                locationid: "",
                category: ""
              })}
              variant="outlined"><Close />清除</Button>
          </React.Fragment>
        }
        columns={[
          { key: 'status', label: t('status'), enable: true },
          { key: 'category', label: t('category'), sortable: true, enable: true },
          { key: 'name', label: t('name'), sortable: true, enable: true },
          { key: 'ip', label: t('ip'), enable: true },
        ]}
        actions={[
          { show: handleActionShow, name: "進出", onClick: (e, row) => history.push(`/device/card-status/${row.id}`), icon: <MeetingRoom /> },
          { name: t('edit'), onClick: handleEditDeviceOpen, icon: <BorderColorSharp /> },
        ]}
      />
    </React.Fragment>
  );
}
