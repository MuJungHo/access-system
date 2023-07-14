import React, { useContext } from "react";
// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import DetailCard from "./DetailCard";

import {
  Paper,
  Divider,
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
import Close from '@material-ui/icons/Close';

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
  scheduleTimes,
  setScheduleTimes,
  scheduleWeek,
  setScheduleWeek,
  scheduleType,
  setScheduleType
}) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const isCheckedAll = Object.values(scheduleWeek).every(e => e)
  const isIndeterminate = Object.values(scheduleWeek).some(e => e)
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
  return (
    <DetailCard title={"時間設定"} style={{ marginBottom: 20 }}>
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
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                  <IconButton><Close /></IconButton>

                </div>)
            }
          </div>
        </React.Fragment>}
      </div>
    </DetailCard>
  )
}
