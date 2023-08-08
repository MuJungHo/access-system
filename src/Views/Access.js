import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { LayoutContext } from "../contexts/LayoutContext";
import { AuthContext } from "../contexts/AuthContext";
import { LocaleContext } from "../contexts/LocaleContext";
import { Button, MenuItem, IconButton, Paper, Select, TablePagination, Avatar } from '@material-ui/core';
import MuiSelect from "../components/Select"
import Tab from '../components/common/Tab';
import Tabs from "../components/common/Tabs"
import SearchTextField from "../components/common/SearchTextField"
import AddAccessModalComponent from "../components/access/AddAccessModalComponent"
import { Router, Person, Delete, SettingsInputComponent, People } from '@material-ui/icons';
import { palette } from "../customTheme";

const viewBackgroundColor = "#e5e5e5"
const rightLimit = 14
const leftLimit = 7

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
    paddingTop: 12
  },
  leftContentInner: {
    backgroundColor: viewBackgroundColor,
    // height: '100%',
    flex: 1,
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
    width: 'calc(50% - 12px)',
    height: 50,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 8,
    // marginRight: 8,
    marginTop: 8,
    borderRadius: 5
  },
}));

const Access = () => {
  const classes = useStyles();
  const [leftTabIndex, setLeftTabIndex] = React.useState(0);
  const [rightTabIndex, setRightTabIndex] = React.useState(0);
  const [selected, setSelected] = React.useState({ _id: 0 });
  const [mode, setMode] = React.useState("dtos");
  const [leftFilter, setLeftFilter] = React.useState({
    page: 0,
    keyword: ""
  });
  const [leftSelectOptions, setLeftSelectOptions] = React.useState([])
  const [leftTotal, setLeftTotal] = React.useState(0)
  const [leftItems, setLeftItems] = React.useState([])

  const [rightFilter, setRightFilter] = React.useState({
    page: 0,
    keyword: ""
  });
  const [rightTotal, setRightTotal] = React.useState(0)
  const [rightItems, setRightItems] = React.useState([])

  const [isExisted, setExisted] = React.useState([])

  const { authedApi } = React.useContext(AuthContext);
  const { t } = React.useContext(LocaleContext);
  const { setSnackBar, showModal, hideModal, showWarningConfirm } = React.useContext(LayoutContext);

  const handleChangeRightFilter = (key, value) => {
    const newFilter = key === "page"
      ? {
        ...rightFilter,
        [key]: value
      }
      : {
        ...rightFilter,
        page: 0,
        [key]: value
      }
    setRightFilter(newFilter)
    if (mode === "dtos") {
      if (leftTabIndex === 0) {
        if (rightTabIndex === 0) {
          getDeviceAccessStaffList(newFilter)
        } else {
          getDeviceAccessStaffGroupList(newFilter)
        }
      } else {
        if (rightTabIndex === 0) {
          getDeviceGroupAccessStaffList(newFilter)
        } else {
          getDeviceAccessStaffGroupList(newFilter)
        }
      }
    } else {
      if (leftTabIndex === 0) {
        if (rightTabIndex === 0) {
          getStaffAccessDeviceList(newFilter)
        } else {
          getStaffAccessDeviceGroupList(newFilter)
        }
      } else {
        if (rightTabIndex === 0) {
          getStaffGroupAccessDeviceList(newFilter)
        } else {
          getStaffGroupAccessDeviceGroupList(newFilter)
        }
      }
    }
  }

  const getStaffGroupAccessDeviceList = async ({ page = 0, keyword = "", limit = rightLimit } = {}) => {
    const { result, total, ids } = await authedApi.getStaffGroupAccessList({ page: page + 1, keyword, limit, staffgroupid: selected.staffgroupid, private_only: 1 })
    let _ids = ids || []
    const _access = result.map(data => {
      return {
        ...data,
        _id: data.id,
        name: data.name
      }
    })
    setRightTotal(total)
    setRightItems(_access)
    setExisted(_ids)
  }

  const getStaffGroupAccessDeviceGroupList = async ({ page = 0, keyword = "", limit = rightLimit } = {}) => {
    const { result, total, groupids } = await authedApi.getStaffGroupAccessList({ page: page + 1, keyword, limit, staffgroupid: selected.staffgroupid, group_only: 1 })
    let _groupids = groupids || []
    const _access = result.map(data => {
      return {
        ...data,
        _id: data.groupid,
        name: data.groupname
      }
    })
    setRightTotal(total)
    setRightItems(_access)
    setExisted(_groupids)
  }

  const getStaffAccessDeviceGroupList = async ({ page = 0, keyword = "", limit = rightLimit } = {}) => {
    const { result, total, groupids_p } = await authedApi.getStaffAccessList({ page: page + 1, keyword, limit, staffid: selected._id, group_only: 1 })
    let _groupids_p = groupids_p || []
    const _access = result.map(data => {
      return {
        ...data,
        _id: data.groupid,
        name: data.groupname
      }
    })
    setRightTotal(total)
    setRightItems(_access)
    setExisted(_groupids_p)
  }

  const getStaffAccessDeviceList = async ({ page = 0, keyword = "", limit = rightLimit } = {}) => {
    const { result, total, ids_p } = await authedApi.getStaffAccessList({ page: page + 1, keyword, limit, staffid: selected._id, private_only: 1 })
    let _ids_p = ids_p || [];
    const _access = result.map(data => {
      return {
        ...data,
        _id: data.id,
        name: data.name,
        disabled: !_ids_p.includes(data.id),
      }
    })
    setRightTotal(total)
    setRightItems(_access)
    setExisted(_ids_p)
  }

  const getDeviceAccessStaffList = async ({ page = 0, keyword = "", limit = rightLimit } = {}) => {
    // return console.log(selected)
    const { result, total, staffids_p } = await authedApi.getDeviceAccessList({ page: page + 1, keyword, limit, id: selected._id, private_only: 1 })
    let _staffids_p = staffids_p || [];
    const _access = result.map(data => {
      return {
        ...data,
        _id: data.staffid,
        name: data.staffname,
        disabled: !_staffids_p.includes(data.staffid),
        // isG: staffids_g.includes(data.staffid)
      }
    })
    setRightTotal(total)
    setRightItems(_access)
    setExisted(_staffids_p)
  }

  const getDeviceAccessStaffGroupList = async ({ page = 0, keyword = "", limit = rightLimit } = {}) => {
    // return console.log(selected)
    const { result, total, staffgroupids_p } = await authedApi.getDeviceAccessList({ page: page + 1, keyword, limit, id: selected._id, group_only: 1 })
    let _staffgroupids_p = staffgroupids_p || []
    const _access = result.map(data => {
      return {
        ...data,
        _id: data.staffgroupid,
        name: data.staffgroupname
      }
    })
    setRightTotal(total)
    setRightItems(_access)
    setExisted(_staffgroupids_p)
  }

  const getDeviceGroupAccessStaffGroupList = async ({ page = 0, keyword = "", limit = rightLimit } = {}) => {
    // return console.log(selected)
    const { result, total } = await authedApi.getDeviceGroupAccessList({ page: page + 1, keyword, limit, groupid: selected.groupid, group_only: 1 })
    const _access = result.map(data => {
      return {
        ...data,
        _id: data.staffgroupid,
        name: data.staffgroupname
      }
    })
    setRightTotal(total)
    setRightItems(_access)
    setExisted([])
  }

  const getDeviceGroupAccessStaffList = async ({ page = 0, keyword = "", limit = rightLimit } = {}) => {
    // return console.log(selected)
    const { result, total, staffids } = await authedApi.getDeviceGroupAccessList({ page: page + 1, keyword, limit, groupid: selected.groupid, private_only: 1 })
    let _staffids = staffids || []
    const _access = result.map(data => {
      return {
        ...data,
        _id: data.staffid,
        name: data.staffname
      }
    })
    setRightTotal(total)
    setRightItems(_access)
    setExisted(_staffids)
  }

  const getDeviceGroupOptions = async () => {
    const { result } = await authedApi.getDevcieGroupList({ page: 1, limit: 10000 })
    const options = result.map(data => {
      return {
        ...data,
        _id: data.groupid,
      }
    })
    setLeftSelectOptions(options)
  }

  const getStaffGroupOptions = async () => {
    const { result: _result } = await authedApi.getStaffGroupList({ page: 1, limit: 10000 })
    const _options = _result.map(data => {
      return {
        ...data,
        _id: data.staffgroupid,
      }
    })
    setLeftSelectOptions(_options)
  }

  const handleChangeLeftFilter = (key, value) => {

    const newFilter = key === "page"
      ? {
        ...leftFilter,
        [key]: value
      }
      : {
        ...leftFilter,
        page: 0,
        [key]: value
      }
    setLeftFilter(newFilter)
    if (mode === "dtos") {
      if (leftTabIndex === 0) {
        getDeviceList(newFilter)
      } else {
        getDevcieGroupList(newFilter)
      }
    } else {
      if (leftTabIndex === 0) {
        getStaffList(newFilter)
      } else {
        getStaffGroupList(newFilter)
      }
    }
  }

  const getDeviceList = async ({ page = 0, keyword = "", limit = leftLimit, groupid = "" } = {}) => {
    const { result, total } = await authedApi.getDeviceList({ page: page + 1, keyword, limit, groupid, access: 1 })
    const _devices = result.map(data => {
      return {
        ...data,
        _id: data.id,
      }
    })
    setLeftTotal(total)
    setLeftItems(_devices)
    if (_devices.length > 0)
      setSelected(_devices[0])
  }

  const getDevcieGroupList = async ({ page = 0, keyword = "", limit = leftLimit } = {}) => {
    const { result, total } = await authedApi.getDevcieGroupList({ page: page + 1, keyword, limit })
    const _groups = result.map(data => {
      return {
        ...data,
        _id: data.groupid,
      }
    })
    setLeftTotal(total)
    setLeftItems(_groups)
    if (_groups.length > 0)
      setSelected(_groups[0])
  }

  const getStaffList = async ({ page = 0, keyword = "", limit = leftLimit, groupid = "" } = {}) => {
    const { result, total } = await authedApi.getStaffList({
      data: {
        group: [groupid]
      },
      keyword,
      limit,
      page: page + 1,
      group: undefined
    })
    const _staffs = result.map(data => {
      return {
        ...data,
        _id: data.staffid,
      }
    })
    setLeftTotal(total)
    setLeftItems(_staffs)
    if (_staffs.length > 0)
      setSelected(_staffs[0])
  }

  const getStaffGroupList = async ({ page = 0, keyword = "", limit = leftLimit } = {}) => {
    const { result, total } = await authedApi.getStaffGroupList({ page: page + 1, keyword, limit })
    const _groups = result.map(data => {
      return {
        ...data,
        _id: data.staffgroupid,
      }
    })
    setLeftTotal(total)
    setLeftItems(_groups)
    if (_groups.length > 0)
      setSelected(_groups[0])
  }

  React.useEffect(() => {
    if (selected._id === 0) return
    renderRight()
  }, [rightTabIndex, selected, mode])

  const renderRight = () => {
    if (mode === "dtos") {
      if (leftTabIndex === 0) {
        if (rightTabIndex === 0) {
          getDeviceAccessStaffList()
        } else {
          getDeviceAccessStaffGroupList()
        }
      }
      else {
        if (rightTabIndex === 0) {
          getDeviceGroupAccessStaffList()
        } else {
          getDeviceGroupAccessStaffGroupList()
        }
      }
    } else {
      if (leftTabIndex === 0) {
        if (rightTabIndex === 0) {
          getStaffAccessDeviceList()
        } else {
          getStaffAccessDeviceGroupList()
        }
      } else {
        if (rightTabIndex === 0) {
          getStaffGroupAccessDeviceList()
        } else {
          getStaffGroupAccessDeviceGroupList()
        }
      }
    }
  }

  React.useEffect(() => {
    setLeftFilter({
      page: 0,
      keyword: "",
      limit: leftLimit,
    })
    renderLeft()
  }, [leftTabIndex, mode])

  const renderLeft = () => {
    if (mode === "dtos") {
      if (leftTabIndex === 0) {
        getDeviceList()
        getDeviceGroupOptions()
      }
      else {
        getDevcieGroupList()
      }
    } else {
      if (leftTabIndex === 0) {
        getStaffList()
        getStaffGroupOptions()
      }
      else {
        getStaffGroupList()
      }
    }
  }

  const handleChangeMode = (e) => {
    setMode(e.target.value)
    setSelected({ _id: 0 })
    setLeftTabIndex(0)
    setRightTabIndex(0)
  }

  const showDeteleAccessConfirm = (item) => {
    let target = ""
    if (mode === "dtos") {
      if (rightTabIndex === 0) {
        target = "人員 " + item.staffname
      } else {
        target = "人員群組 " + item.staffgroupname
      }
    } else {
      if (rightTabIndex === 0) {
        target = "設備 " + item.name
      } else {
        target = "設備群組" + item.groupname
      }
    }
    showWarningConfirm({
      title: '刪除權限',
      component: <h6 style={{ margin: 16 }}>{`確認刪除 ${target} 的權限嗎?`}</h6>,
      onConfirm: () => handleDeleteAccess(item)
    })
  }

  const handleDeleteAccess = async (item) => {
    // console.log(item, selected)
    let data = {
      operation: "delete",
      sn: 0,
      id: null,
      staffid: null,
      staffgroupid: null,
      groupid: null,
    }
    if (mode === "dtos") {
      if (leftTabIndex === 0) {
        if (rightTabIndex === 0) {
          data.id = selected.id
          data.staffid = item.staffid
        } else {
          data.id = selected.id
          data.staffgroupid = item.staffgroupid
        }
      }
      else {
        if (rightTabIndex === 0) {
          data.groupid = selected.groupid
          data.staffid = item.staffid
        } else {
          data.groupid = selected.groupid
          data.staffgroupid = item.staffgroupid
        }
      }
    } else {
      if (leftTabIndex === 0) {
        if (rightTabIndex === 0) {
          data.staffid = selected.staffid
          data.id = item.id
        } else {
          data.staffid = selected.staffid
          data.groupid = item.groupid
        }
      } else {
        if (rightTabIndex === 0) {
          data.staffgroupid = selected.staffgroupid
          data.id = item.id
        } else {
          data.staffgroupid = selected.staffgroupid
          data.groupid = item.groupid
        }
      }
    }
    await authedApi.addAccess({ data: [data] })
    renderRight()
  }
  const handleOpenAddModal = () => {
    showModal({
      title: "可新增的項目",
      component: <AddAccessModalComponent
        mode={mode}
        leftTabIndex={leftTabIndex}
        rightTabIndex={rightTabIndex}
        isExisted={isExisted}
        authedApi={authedApi}
        onSave={(state) => handleAddAccess(state)} />
    })
  }

  const handleAddAccess = async (state) => {
    let data = state.map((item, sn) => {
      let _id = Number(item)
      let data = {
        operation: "update",
        sn,
        id: null,
        staffid: null,
        staffgroupid: null,
        groupid: null,
      }
      if (mode === "dtos") {
        if (leftTabIndex === 0) {
          if (rightTabIndex === 0) {
            data.id = selected.id
            data.staffid = _id
          } else {
            data.id = selected.id
            data.staffgroupid = _id
          }
        }
        else {
          if (rightTabIndex === 0) {
            data.groupid = selected.groupid
            data.staffid = _id
          } else {
            data.groupid = selected.groupid
            data.staffgroupid = _id
          }
        }
      } else {
        if (leftTabIndex === 0) {
          if (rightTabIndex === 0) {
            data.staffid = selected.staffid
            data.id = _id
          } else {
            data.staffid = selected.staffid
            data.groupid = _id
          }
        } else {
          if (rightTabIndex === 0) {
            data.staffgroupid = selected.staffgroupid
            data.id = _id
          } else {
            data.staffgroupid = selected.staffgroupid
            data.groupid = _id
          }
        }
      }
      return data
    })
    await authedApi.addAccess({ data })
    hideModal()
    renderRight()
  }

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
            <SearchTextField style={{ flex: 'unset' }} placeholder={"搜尋關鍵字"} value={leftFilter.keyword} onChange={e => handleChangeLeftFilter('keyword', e.target.value)} />
            {leftTabIndex === 0 && <MuiSelect
              onChange={e => handleChangeLeftFilter('groupid', e.target.value)}
              style={{ marginTop: 20 }}
              value={leftFilter.groupid || ""}
              label="群組 ">
              {
                leftSelectOptions.map(item => <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>)
              }
            </MuiSelect>}
            <div className={classes.leftContentInner}>
              {
                leftItems.map(item => (
                  <div
                    style={selected._id === item._id ? { border: '3px solid' + palette.primary.main } : { border: '3px solid white' }}
                    className={classes.leftContentInnerItem}
                    onClick={() => setSelected(item)}
                    key={item._id}>
                    {
                      leftTabIndex === 0
                        ? mode === "dtos" ? <Router style={{ margin: 10 }} />
                          :
                          item.photo
                            ? <Avatar style={{ width: 30, height: 30, marginLeft: 5, marginRight: 5 }} src={`data:image/png;base64,${item.photo}`} />
                            : <Person style={{ margin: 10 }} />
                        : mode === "dtos"
                          ? <SettingsInputComponent style={{ margin: 10 }} />
                          : <People style={{ margin: 10 }} />
                    }
                    {item.name}
                  </div>
                ))
              }
            </div>
            <TablePagination
              rowsPerPageOptions={[]}
              component="div"
              count={leftTotal}
              rowsPerPage={leftLimit}
              page={leftFilter.page}
              onPageChange={(event, newPage) => handleChangeLeftFilter("page", newPage)}
            />
          </Paper>
        </div>
        <div className={classes.right}>
          <div className={classes.rightTopSelect}>
            <Select value={mode} onChange={handleChangeMode}>
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
            <div>
              <Button variant="contained" color="primary" onClick={handleOpenAddModal}>新增</Button>
            </div>

          </div>
          <Paper className={classes.rightContet}>
            <div className={classes.rightContetTopbar}>
              {selected.name}
              <div>
                <SearchTextField placeholder={"搜尋關鍵字"} style={{ width: 300 }} onChange={e => handleChangeRightFilter("keyword", e.target.value)} />
              </div>
            </div>
            <div className={classes.rightContentInner}>
              {
                selected.name !== undefined
                  ?
                  rightItems.map(item => (
                    <div className={classes.rightContentInnerItem} key={item._id}>
                      {
                        rightTabIndex === 0
                          ? mode === "dtos"
                            ?
                            item.photo
                              ? <Avatar style={{ width: 30, height: 30, marginLeft: 5, marginRight: 5 }} src={`data:image/png;base64,${item.photo}`} />
                              : <Person style={{ margin: 10 }} />
                            : <Router style={{ margin: 10 }} />
                          : mode === "dtos" ? <People style={{ margin: 10 }} /> : <SettingsInputComponent style={{ margin: 10 }} />
                      }
                      <span style={{ flex: 1 }}>{item.name}</span>
                      {/* {item.isG && <Avatar >G</Avatar>} */}
                      <IconButton disabled={item.disabled} onClick={() => showDeteleAccessConfirm(item)}>
                        <Delete />
                      </IconButton>
                    </div>))
                  : <h6 style={{ margin: 20 }}>{`請選擇一個左側的${mode === "dtos" ? "設備" : "人員"}`}</h6>
              }
            </div>
            <TablePagination
              rowsPerPageOptions={[]}
              component="div"
              count={rightTotal}
              rowsPerPage={rightLimit}
              page={rightFilter.page}
              onPageChange={(event, newPage) => handleChangeRightFilter("page", newPage)}
            />
          </Paper>
        </div>
      </div>
    </div >
  );
}


export default Access;