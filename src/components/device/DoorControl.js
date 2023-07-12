import React, { useContext } from "react";
// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"

import {
  Paper,
  Divider,
  Button,
  MenuItem
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  }
}));

const mins = ["100", "300", "500", "1000", "3000", "5000"]

export default ({
}) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const [minutes, setMinutes] = React.useState()
  // console.log(deviceEditModal)
  return (
    <Paper className={classes.paper}>
      <div style={{ padding: 20, fontSize: 16 }}>遠距開門</div>
      <Divider />
      <div style={{ display: 'flex', padding: 20 }}>
        <div style={{ flex: 1 }}>
          <span>單次開門</span>
          <Select
            style={{ marginLeft: 20 }}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            label={"分鐘"}
          >
            {
              mins
                .map(min =>
                  <MenuItem
                    key={min}
                    value={min}>
                    {min}
                  </MenuItem>)
            }
          </Select>
          <Button
            style={{ marginLeft: 20 }} color="primary" variant="contained">解鎖</Button>
        </div>
        <div style={{ flex: 1 }}>
          <span>持續開門</span>

          <Button
            style={{ marginLeft: 20 }} color="primary" variant="contained">解鎖</Button>
          <Button
            style={{ marginLeft: 20 }} color="primary" variant="contained">上鎖</Button>
        </div></div>
    </Paper>
  )
}
