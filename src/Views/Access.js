import React from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Button, MenuItem, IconButton, Paper, Select } from '@material-ui/core';
import MuiSelect from "../components/Select"
import Tab from '../components/common/Tab';
import Tabs from "../components/common/Tabs"
import SearchTextField from "../components/common/SearchTextField"
import { Router, Person, Delete, SettingsInputComponent, People } from '@material-ui/icons';
import { palette } from "../customTheme";

const viewBackgroundColor = "#e5e5e5"

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 'calc(100vh - 100px)',
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: 1,
    // backgroundColor: viewBackgroundColor,
    display: 'flex',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    width: 350,
  },
  leftContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  leftContentInner: {
    backgroundColor: viewBackgroundColor,
    height: '100%',
    marginTop: 20
  },
  leftContentInnerItem: {
    height: 50,
    backgroundColor: '#fff',
    margin: 8,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 5,
    cursor: "pointer"
  },
  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 20
  },
  rightTopSelect: {
    textAlign: 'right',
    height: 48
  },
  rightTopbar: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  rightContet: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  rightContetTopbar: {
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold'
  },
  rightContentInner: {
    flex: 1,
    backgroundColor: viewBackgroundColor,
    display: 'flex',
    flexWrap: 'wrap',
    // justifyContent: 'space-around',
    alignItems: 'flex-start',
    alignContent: 'flex-start'
  },
  rightContentInnerItem: {
    width: 'calc(50% - 16px)',
    height: 50,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    borderRadius: 5
  },
}));

const devices = [
  { id: 'device1', name: 'device1' },
  { id: 'device2', name: 'device2' },
  { id: 'device3', name: 'device3' },
  { id: 'device4', name: 'device4' },
  { id: 'device5', name: 'device5' },
  { id: 'device6', name: 'device6' },
  // { id: 'device7', name: 'device7' },
  // { id: 'device8', name: 'device8' },
  // { id: 'device9', name: 'device9' },
  // { id: 'device10', name: 'device10' },
]

const device_groups = [
  { id: 'group1', name: 'group1' },
  { id: 'group2', name: 'group2' },
  { id: 'group3', name: 'group3' },
  { id: 'group4', name: 'group4' },
  { id: 'group5', name: 'group5' },
  { id: 'group6', name: 'group6' }
]

const staffs = [
  { id: 'staff1', name: 'staff1' },
  { id: 'staff2', name: 'staff2' },
  { id: 'staff3', name: 'staff3' },
  { id: 'staff4', name: 'staff4' },
  { id: 'staff5', name: 'staff5' },
  { id: 'staff6', name: 'staff6' }
]

const staff_groups = [
  { id: 'group1', name: 'group1' },
  { id: 'group2', name: 'group2' },
  { id: 'group3', name: 'group3' },
  { id: 'group4', name: 'group4' },
  { id: 'group5', name: 'group5' },
  { id: 'group6', name: 'group6' }
]

const Access = () => {
  const classes = useStyles();
  const [leftTabIndex, setLeftTabIndex] = React.useState(0);
  const [rightTabIndex, setRightTabIndex] = React.useState(0);
  const [selected, setSelected] = React.useState("");
  const [mode, setMode] = React.useState("dtos");

  React.useEffect(() => {
    let result = "";
    if (mode === "dtos") {
      if (leftTabIndex === 0) result = devices[0].id
      else result = device_groups[0].id
    } else {
      if (leftTabIndex === 0) result = staffs[0].id
      else result = staff_groups[0].id
    }
    setSelected(result)
  }, [leftTabIndex])

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.left}>
          <Tabs
            value={leftTabIndex}
            TabIndicatorProps={{ style: { background: 'white' } }}
            onChange={(event, newValue) => {
              setLeftTabIndex(newValue);
            }}
            variant="fullWidth"
            textColor="primary"
          >
            <Tab label={mode === "dtos" ? "設備" : "人員"} />
            <Tab label="群組" />
          </Tabs>
          <Paper className={classes.leftContent}>
            <SearchTextField placeholder={"搜尋關鍵字"} />
            {leftTabIndex === 0 && <MuiSelect style={{ marginTop: 20 }} value="" label="群組 ">
              {
                device_groups.map(group => <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>)
              }
            </MuiSelect>}
            <div className={classes.leftContentInner}>
              {
                mode === "dtos"
                  ?
                  (
                    leftTabIndex === 0
                      ?
                      devices.map(device => (
                        <div
                          style={selected === device.id ? { border: '3px solid' + palette.primary.main } : { border: '3px solid white' }}
                          className={classes.leftContentInnerItem}
                          onClick={() => setSelected(device.id)}
                          key={device.id}>
                          <Router style={{ margin: 10 }} /> {device.name}
                        </div>
                      ))
                      :
                      device_groups.map(group => (
                        <div
                          style={selected === group.id ? { border: '3px solid' + palette.primary.main } : { border: '3px solid white' }}
                          className={classes.leftContentInnerItem}
                          onClick={() => setSelected(group.id)}
                          key={group.id}>
                          <SettingsInputComponent style={{ margin: 10 }} /> {group.name}
                        </div>
                      ))
                  )
                  :
                  (
                    leftTabIndex === 0
                      ?
                      staffs.map(staff => (
                        <div
                          style={selected === staff.id ? { border: '3px solid' + palette.primary.main } : { border: '3px solid white' }}
                          className={classes.leftContentInnerItem}
                          onClick={() => setSelected(staff.id)}
                          key={staff.id}>
                          <Person style={{ margin: 10 }} /> {staff.name}
                        </div>
                      ))
                      :
                      staff_groups.map(group => (
                        <div
                          style={selected === group.id ? { border: '3px solid' + palette.primary.main } : { border: '3px solid white' }}
                          className={classes.leftContentInnerItem}
                          onClick={() => setSelected(group.id)}
                          key={group.id}>
                          <People style={{ margin: 10 }} /> {group.name}
                        </div>
                      ))
                  )
              }
            </div>
          </Paper>
        </div>
        <div className={classes.right}>
          <div className={classes.rightTopSelect}>
            <Select value={mode} onChange={e => setMode(e.target.value)}>
              <MenuItem value="dtos">Device to Staff</MenuItem>
              <MenuItem value="stod">Staff to Device</MenuItem>
            </Select>
          </div>
          <div className={classes.rightTopbar}>
            <Tabs
              style={{ width: 350 }}
              value={rightTabIndex}
              TabIndicatorProps={{ style: { background: 'white' } }}
              onChange={(event, newValue) => {
                setRightTabIndex(newValue);
              }}
              variant="fullWidth"
              textColor="primary"
            >
              <Tab label={mode === "dtos" ? "人員" : "設備"} />
              <Tab label="群組" />
            </Tabs>
            <div><Button variant="contained" color="primary">新增</Button></div>

          </div>
          <Paper className={classes.rightContet}>
            <div className={classes.rightContetTopbar}>
              {selected}
              <div>
                <SearchTextField placeholder={"搜尋關鍵字"} style={{ width: 300 }} />
              </div>
            </div>
            <div className={classes.rightContentInner}>
              {
                selected
                  ?
                  mode === "dtos"
                    ?
                    (
                      rightTabIndex === 0
                        ?
                        staffs.map(staff => (
                          <div className={classes.rightContentInnerItem} key={staff.id}>
                            <Person style={{ margin: 10 }} />
                            <span style={{ flex: 1 }}>{staff.name}</span>
                            <IconButton>
                              <Delete />
                            </IconButton>
                          </div>
                        ))
                        :
                        staff_groups.map(group => (
                          <div className={classes.rightContentInnerItem} key={group.id}>
                            <People style={{ margin: 10 }} />
                            <span style={{ flex: 1 }}>{group.name}</span>
                            <IconButton>
                              <Delete />
                            </IconButton>
                          </div>
                        ))
                    )
                    : (
                      rightTabIndex === 0
                        ?
                        devices.map(device => (
                          <div className={classes.rightContentInnerItem} key={device.id}>
                            <Router style={{ margin: 10 }} />
                            <span style={{ flex: 1 }}>{device.name}</span>
                            <IconButton>
                              <Delete />
                            </IconButton>
                          </div>
                        ))
                        :
                        device_groups.map(group => (
                          <div className={classes.rightContentInnerItem} key={group.id}>
                            <SettingsInputComponent style={{ margin: 10 }} />
                            <span style={{ flex: 1 }}>{group.name}</span>
                            <IconButton>
                              <Delete />
                            </IconButton>
                          </div>
                        ))
                    )
                  : <h6 style={{ margin: 20 }}>{`請選擇一個左側的${mode === "dtos" ? "設備" : "人員"}`}</h6>
              }
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}


export default Access;