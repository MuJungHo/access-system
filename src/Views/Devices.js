import React from "react";
// import { AuthContext } from "../contexts/AuthContext";
// import { LocaleContext } from "../contexts/LocaleContext";
import { DeviceProvider } from "../contexts/DeviceContext";
// import { useHistory } from "react-router-dom"
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import DeviceList from '../components/device/DeviceList'
import DeviceGroup from '../components/device/DeviceGroup'

const StyledTabs = withStyles(theme => ({
  root: {
    width: '30%',
    boxShadow: theme.shadows[1],
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    // "& .MuiOutlinedInput-notchedOutline": {
    //   borderColor: 'rgba(190, 190, 190, 0.4)'
    // }
  }
}))((props) => <Tabs {...props} />)

const StyledTab = withStyles(theme => ({
  root: {
    // width: '30%',
    // "& .MuiOutlinedInput-notchedOutline": {
    //   borderColor: 'rgba(190, 190, 190, 0.4)'
    // }
  }
}))((props) => <Tab {...props} />)

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
    <DeviceProvider>
      <div className={classes.root}>
        <StyledTabs
          value={tabIndex}
          TabIndicatorProps={{ style: { background: 'white' } }}
          onChange={(event, newValue) => {
            setTabIndex(newValue);
          }}
          variant="fullWidth"
          textColor="primary"
        >
          <StyledTab label="設備列表" />
          <StyledTab label="設備群組" />
        </StyledTabs>

        <Paper className={classes.paper}>
          {
            {
              0: <DeviceList />,
              1: <DeviceGroup />
            }[tabIndex]
          }
        </Paper>

      </div>
    </DeviceProvider>
  );
}
