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
import CameraBind from '../../components/device/CameraBind';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  }
}));

const config = {
  "PMS": ["Child"],
  "VMS": ["CameraBind"],
  "ACC": ["Child"],
  "ACR": ["DoorControl", "Schedule", "CameraBind"]
}

export default () => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useContext(LocaleContext);
  const { authedApi, loading } = useContext(AuthContext);
  const { deviceid } = useParams();
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
  const [securityLevel, setSecurityLevel] = React.useState({});

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
      setChildDevices(child)

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

      setCamerabinds(camerabind)
    })()
  }, [])
  return (
    <div className={classes.root}>
      <IconButton onClick={() => history.push('/device/list')}><ArrowBackIcon /></IconButton>
      <DeviceConfiguration
        deviceConfig={deviceConfig}
        setDeviceConfig={setDeviceConfig} />
      {config[deviceConfig.Category]?.includes("DoorControl") && <DoorControl />}
      {config[deviceConfig.Category]?.includes("Schedule") && <Schedule
        scheduleType={scheduleType}
        setScheduleType={setScheduleType}
        scheduleTimes={scheduleTimes}
        setScheduleTimes={setScheduleTimes}
        scheduleWeek={scheduleWeek}
        setScheduleWeek={setScheduleWeek} />}
      {config[deviceConfig.Category]?.includes("Child") && <Child childDevices={childDevices} />}
      {config[deviceConfig.Category]?.includes("CameraBind") && <CameraBind camerabinds={camerabinds} />}
    </div>)
}