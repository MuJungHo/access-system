import React, { useContext } from "react";
// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { AuthContext } from "../../contexts/AuthContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { makeStyles } from '@material-ui/core/styles';
// import Select from "../../components/Select"
import DetailCard from "../DetailCard";

import {

  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Button,
  TextField,
  IconButton
} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  },
  time: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    height: 36
  }
}));

export default ({
  id,
  scheduleTimes,
  setScheduleTimes,
  scheduleWeek,
  setScheduleWeek,
  scheduleType,
  setScheduleType
}) => {
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);
  const { setSnackBar } = useContext(LayoutContext);
  // console.log(scheduleTimes)
  const classes = useStyles();
  const isCheckedAll = Object.values(scheduleWeek).every(e => e)
  const isIndeterminate = Object.values(scheduleWeek).some(e => e)

  const [isLoading, setLoading] = React.useState(false)

  const handleCheckedAll = e => {
    setScheduleWeek({
      _sun: e.target.checked,
      _mon: e.target.checked,
      _tue: e.target.checked,
      _wed: e.target.checked,
      _thu: e.target.checked,
      _fri: e.target.checked,
      _sat: e.target.checked
    })
  }

  const handleUpdateStartTimeRange = (e, time) => {
    let newTimes = scheduleTimes.map(t => {
      return t.time === time.time
        ? { ...t, start: e.target.value } : { ...t }
    })
    setScheduleTimes(newTimes)
  }

  const handleUpdateEndTimeRange = (e, time) => {
    let newTimes = scheduleTimes.map(t => {
      return t.time === time.time
        ? { ...t, end: e.target.value } : { ...t }
    })
    setScheduleTimes(newTimes)
  }

  const handleDeleteTimeRange = (time) => {
    let newTimes = scheduleTimes.filter(t => t.time !== time.time)
    setScheduleTimes(newTimes)
    // console.log(scheduleTimes, time)
  }

  const handleSaveSchedule = async () => {
    setLoading(true)
    let time_table = scheduleTimes.map(time => `${time.start}-${time.end}`)
    let weekArr = []
    if (scheduleWeek._mon) weekArr.push("1")
    if (scheduleWeek._tue) weekArr.push("2")
    if (scheduleWeek._wed) weekArr.push("3")
    if (scheduleWeek._thu) weekArr.push("4")
    if (scheduleWeek._fri) weekArr.push("5")
    if (scheduleWeek._sat) weekArr.push("6")
    if (scheduleWeek._sun) weekArr.push("7")
    // console.log(scheduleTimes, weekArr)
    if (scheduleType === 'all') {
      time_table = ["00:00-23:59"]
      weekArr = ["1", "2", "3", "4", "5", "6", "7"]
    }
    await authedApi.putDeviceSchedule({ data: { time_table, week: weekArr.join(",") }, id })
    setLoading(false)

    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  return (
    <DetailCard loading={isLoading} title={"時間設定"} style={{ marginBottom: 20 }} onClick={handleSaveSchedule}>
      <div style={{ padding: 16 }}>
        <RadioGroup value={scheduleType} onChange={e => setScheduleType(e.target.value)} row>
          <FormControlLabel value="all" control={<Radio color="primary" />} label="全時段" />
          <FormControlLabel value="custom" control={<Radio color="primary" />} label="自訂時間" />
        </RadioGroup>
        {scheduleType === "custom" && <React.Fragment>
          <FormGroup row>
            <FormControlLabel
              label={"all"}
              control={<Checkbox
                color="primary"
                indeterminate={isIndeterminate && !isCheckedAll}
                checked={isCheckedAll}
                onChange={handleCheckedAll} />} />
            {
              Object.keys(scheduleWeek).map(weekday =>
                <FormControlLabel
                  key={weekday}
                  label={t(weekday)}
                  control={<Checkbox
                    color="primary"
                    checked={scheduleWeek[weekday]}
                    onChange={e => setScheduleWeek({ ...scheduleWeek, [weekday]: e.target.checked })} />} />)
            }
          </FormGroup>
          <Button
            color="primary"
            onClick={() => setScheduleTimes([...scheduleTimes, { time: new Date().valueOf(), start: "00:00", end: "23:59" }])}><AddIcon />新增時段</Button>
          <div>
            {
              scheduleTimes.map((time, i) =>
                <div key={time.time} className={classes.time}>
                  <TextField
                    type="time"
                    style={{ marginRight: 20 }}
                    defaultValue={time.start}
                    onChange={(e) => handleUpdateStartTimeRange(e, time)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                  <TextField
                    type="time"
                    style={{ marginRight: 10 }}
                    defaultValue={time.end}
                    onChange={(e) => handleUpdateEndTimeRange(e, time)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                  {scheduleTimes.length > 1 && < IconButton onClick={() => handleDeleteTimeRange(time)}><Delete /></IconButton>}

                </div>)
            }
          </div>
        </React.Fragment>}
      </div>
    </DetailCard >
  )
}
