import React from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tab from '../../components/common/Tab';
import Tabs from "../../components/common/Tabs";
import DeviceList from '../../components/device/DeviceList'
import DeviceGroup from '../../components/device/DeviceGroup'



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    // marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function Devices() {
  const classes = useStyles();
  // const md5 = require("md5");

  const [tabIndex, setTabIndex] = React.useState(0);


  return (
    <div className={classes.root}>
      <Tabs
        style={{ width: 350 }}
        value={tabIndex}
        TabIndicatorProps={{ style: { background: 'white' } }}
        onChange={(event, newValue) => {
          setTabIndex(newValue);
        }}
        variant="fullWidth"
        textColor="primary"
      >
        <Tab label="設備列表" />
        <Tab label="設備群組" />
      </Tabs>

      <Paper className={classes.paper}>
        <DeviceList />
      </Paper>

    </div>
  );
}
