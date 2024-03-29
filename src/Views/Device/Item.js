import React, { useContext } from 'react'
import { useHistory, useParams } from "react-router-dom"

import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  Paper,
  IconButton
} from '@material-ui/core'

import { LocaleContext } from "../../contexts/LocaleContext";
import { AuthContext } from "../../contexts/AuthContext";
import DoorControl from '../../components/device/DoorControl';
import Schedule from '../../components/device/Schedule';
import DeviceConfiguration from '../../components/device/DeviceConfiguration';
import Child from '../../components/device/Child';
import Camera from '../../components/device/Camera';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  }
}));

const config = {
  "ACC": ["Child"],
  "PMS": ["Child"],
  "VMS": ["Child"],
  "FRS": ["Child"],
  "ACR": ["DoorControl", "Schedule", "Camera"],
  "ACCR": ["DoorControl", "Schedule", "Camera"],
  "FRD": ["DoorControl", "Schedule", "Camera"],
  "ELEVC": ["Schedule", "Camera"],
  "ELEVF": [],
  "VMSIPC": [],
  "PMSG": ["Camera"]
}

export default () => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);
  const { deviceid, parentid } = useParams();
  const [deviceConfig, setDeviceConfig] = React.useState({});
  const [childDevices, setChildDevices] = React.useState([]);
  const [scheduleType, setScheduleType] = React.useState("all");
  const [scheduleTimes, setScheduleTimes] = React.useState([]);
  const [scheduleWeek, setScheduleWeek] = React.useState({
    _sun: false,
    _mon: false,
    _tue: false,
    _wed: false,
    _thu: false,
    _fri: false,
    _sat: false
  });
  const [camerabinds, setCamerabinds] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const { config, child, schedule, camerabind } = await authedApi.getDeviceById({ id: deviceid })
      let apb = config.DeviceConfiguration.DeviceSetting.apb || ""
      apb = apb.toString();
      const apb1 = apb.split("")[0];
      const apb2 = apb.split("")[1];
      config.DeviceConfiguration.DeviceSetting.apb1 = apb1
      config.DeviceConfiguration.DeviceSetting.apb2 = apb2

      setDeviceConfig(config.DeviceConfiguration)

      let child_ = child;
      child_ = child_.map(c => ({
        ...c,
        categort: c.config.DeviceConfiguration.Category || "--",
        brand: c.config.DeviceConfiguration.DeviceSetting.Brand || "--"
      }))
      setChildDevices(child_)

      if (schedule) {
        const time_table = schedule?.time_table || []
        const times = time_table.map(time => ({ time, start: time.split("-")[0], end: time.split("-")[1] }))
        setScheduleTimes(times)
        setScheduleWeek({
          _sun: schedule?.week.includes("7"),
          _mon: schedule?.week.includes("1"),
          _tue: schedule?.week.includes("2"),
          _wed: schedule?.week.includes("3"),
          _thu: schedule?.week.includes("4"),
          _fri: schedule?.week.includes("5"),
          _sat: schedule?.week.includes("6")
        })

        const isAll = time_table.length === 1 && time_table[0] === "00:00-23:59" && schedule.week === "1,2,3,4,5,6,7"
        setScheduleType(isAll ? "all" : "custom")
      }

      if (camerabind) {
        let cameraids = camerabind.map(c => c.camera_id)
        // console.log(camerabind)
        setCamerabinds(cameraids)
      }

    })()
  }, [])
  return (
    <div className={classes.root}>
      {/* {console.log(deviceConfig)} */}
      <IconButton onClick={() => history.push(
        parentid === undefined
          ? '/device/management'
          : `/device/item/${parentid}`
      )}><ArrowBackIcon /></IconButton>
      <DeviceConfiguration
        deviceConfig={deviceConfig}
        setDeviceConfig={setDeviceConfig} />
      {config[deviceConfig.Category]?.includes("DoorControl") && <DoorControl id={deviceid} />}
      {config[deviceConfig.Category]?.includes("Schedule") && <Schedule
        id={deviceid}
        scheduleType={scheduleType}
        setScheduleType={setScheduleType}
        scheduleTimes={scheduleTimes}
        setScheduleTimes={setScheduleTimes}
        scheduleWeek={scheduleWeek}
        setScheduleWeek={setScheduleWeek} />}
      {config[deviceConfig.Category]?.includes("Child") && <Child
        childDevices={childDevices}
        setChildDevices={setChildDevices}
        deviceConfig={deviceConfig} />}
      {config[deviceConfig.Category]?.includes("Camera") && <Camera reader_id={deviceid} camerabinds={camerabinds} setCamerabinds={setCamerabinds}/>}
    </div>)
}