import React from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tab from '../../components/common/Tab';
import Tabs from "../../components/common/Tabs";

import StaffList from '../../components/staff/StaffList'
import StaffGroup from '../../components/staff/StaffGroup'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
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
        value={tabIndex}
        style={{ width: 350 }}
        TabIndicatorProps={{ style: { background: 'white' } }}
        onChange={(event, newValue) => {
          setTabIndex(newValue);
        }}
        variant="fullWidth"
        textColor="primary"
      >
        <Tab label="人員列表" />
        <Tab label="人員群組" />
      </Tabs>

      <Paper className={classes.paper}>
        {
          {
            0: <StaffList />,
            1: <StaffGroup />
          }[tabIndex]
        }
      </Paper>

    </div>
  );
}
