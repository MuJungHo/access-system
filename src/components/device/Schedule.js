import React, { useContext } from "react";
// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"

import {
  Paper,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Checkbox,
  TextField
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  }
}));

export default ({
}) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const [type, setType] = React.useState("all")
  const [weekdays, setWeekdays] = React.useState({
    _sun: false,
    _mon: false,
    _tue: false,
    _wed: false,
    _thu: false,
    _fri: false,
    _sat: false
  })
  const isCheckedAll = Object.values(weekdays).every(e => e)
  const isIndeterminate = Object.values(weekdays).some(e => e)
  const handleCheckedAll = e => {
    setWeekdays({
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
    <Paper className={classes.paper}>
      <div style={{ padding: 20, fontSize: 16 }}>時間表設定</div>
      <Divider />
      <div style={{ padding: 20 }}>
        <RadioGroup value={type} onChange={e => setType(e.target.value)} row>
          <FormControlLabel value="all" control={<Radio color="primary" />} label="全時段" />
          <FormControlLabel value="custom" control={<Radio color="primary" />} label="自訂時間" />
        </RadioGroup>
        <FormGroup row>
          <FormControlLabel
            label={"all"}
            control={<Checkbox
              color="primary"
              indeterminate={isIndeterminate && !isCheckedAll}
              checked={isCheckedAll}
              onChange={handleCheckedAll} />} />
          {
            Object.keys(weekdays).map(weekday =>
              <FormControlLabel
                key={weekday}
                label={t(weekday)}
                control={<Checkbox
                  color="primary"
                  checked={weekdays[weekday]}
                  onChange={e => setWeekdays({ ...weekdays, [weekday]: e.target.checked })} />} />)
          }
        </FormGroup>
      </div>
    </Paper>
  )
}
