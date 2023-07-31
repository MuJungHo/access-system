import React, { useContext, useRef } from "react";
import { useHistory } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import {
  // PlayArrow,
  BorderColorSharp,
  Close,
  Delete,
  AddBox,
  Backup,
  CloudDownload,
  PhotoCamera
  // FiberManualRecord
} from '@material-ui/icons';
import Table from "../../components/table/Table";
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@material-ui/core/Tooltip';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import Select from '../../components/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import { identities, credentials } from "../../utils/constants"

import StaffModalComponent from "./StaffModalComponent"
import StaffImportModalComponent from "./StaffImportModalComponent"
import { palette } from '../../customTheme'

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
  const history = useHistory();
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);
  const { setSnackBar, showModal, hideModal, showWarningConfirm } = useContext(LayoutContext);
  const [rows, setRows] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const [groups, setGroups] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    order: 'desc',
    orderBy: 'datetime',
    page: 0,
    limit: 5,
    identity: [],
    location: [],
    group: [],
    credential: []
  })


  React.useEffect(() => {
    (async () => {
      const { result: locationList } = await authedApi.getLocationList({ limit: 50, page: 1 })
      const { result: groupList } = await authedApi.getDevcieGroupList({ limit: 50, page: 1 })
      setLocations(locationList)
      setGroups(groupList)
    })()
  }, [])

  React.useEffect(() => {
    getStaffList()
  }, [filter])

  const getStaffList = async () => {
    const { result, total } = await authedApi.getStaffList({
      data: {
        group: filter.group,
        location: filter.location,
        credential: filter.credential,
        identity: filter.identity
      }, ...filter, page: filter.page + 1, group: undefined, location: undefined, credential: undefined, identity: undefined
    })
    // console.log(result)
    const tableData = result.map(data => {
      const card = data.cardid.map(c => (c.uhfnumber && `UHF number  ${c.uhfnumber}`) || (c.mifarenumber && `Mifare number  ${c.mifarenumber}`)) || '--'
      const vehicle = data.vehicleid.map(v => v.vin).join(' ,') || '--'
      const group = data.groups.map(g => g.name).join(' ,') || '--'
      return {
        ...data,
        id: data.staffid,
        photo: data.photo ? <Avatar src={`data:image/png;base64,${data.photo}`} onClick={(e) => {
          e.stopPropagation()
          showModal({
            title: "相片",
            component: <img src={`data:image/png;base64,${data.photo}`} style={{ display: 'block', margin: 'auto' }} />,
          })
        }} /> : '--',
        card,
        vehicle,
        group,
        groups: undefined,
        cardid: data.cardid.length > 0 ? <AvatarGroup >{
          data.cardid.map(p => <Tooltip key={p.cardidid} title={
            (p.uhfnumber && `UHF number  ${p.uhfnumber}`) ||
            (p.mifarenumber && `Mifare number  ${p.mifarenumber}`) ||
            (p.emnumber && `EM number  ${p.emnumber}`)
          }><Avatar
            style={{
              borderRadius: '15%',
              border: `1px solid ${palette.secondary.main}`,
              backgroundColor: 'white',
              color: palette.secondary.main
            }}>
              {/* <CreditCardIcon /> */}
              {(p.uhf && "UH") || (p.mifare && `MF`) || (p.em && `EM`)}
            </Avatar></Tooltip>)
        }</AvatarGroup> : '--',
        vehicleid: data.vehicleid.length > 0 ? <AvatarGroup >{
          data.vehicleid.map(p => <Tooltip key={p.vehicleidid} title={p.vin}><Avatar
            style={{
              borderRadius: '15%',
              backgroundColor: 'white',
              border: `1px solid ${palette.secondary.main}`,
              color: palette.secondary.main
            }}>
            <DriveEtaIcon />
            {/* {(p.uhf && "U") || (p.mifare && `M`) || (p.em && `E`)} */}
          </Avatar></Tooltip>)
        }</AvatarGroup> : '--',
        faceid: data.faceid.length > 0 ? <AvatarGroup >{
          data.faceid.map(p => <Avatar key={p.faceidid} src={`data:image/png;base64,${p.photo[0].photo}`} />)
        }</AvatarGroup> : '--',
      }
    })
    setTotal(total)
    setRows(tableData)

  }

  const showAddStaffModal = () => {
    showModal({
      title: "新增人員",
      component: <StaffModalComponent onSave={handleAddStaff} />
    })
  }

  const handleAddStaff = async (state) => {

    await authedApi.addStaff({
      data: {
        ...state,
      }, type: 0
    })

    getStaffList()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  const showDeteleStaffConfirm = (row) => {
    showWarningConfirm({
      title: '刪除人員',
      component: <h6 style={{ margin: 16 }}>{`確認刪除人員 ${row.name} ?`}</h6>,
      onConfirm: () => handleDeleteStaff(row.staffid)
    })
  }

  const handleDeleteStaff = async (staffid) => {
    await authedApi.deleteStaff({ staffid })
    getStaffList()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }


  const showImportStaffModal = () => {
    showModal({
      title: "上傳人員檔案",
      maxWidth: "xs",
      fullWidth: true,
      component: <StaffImportModalComponent onSave={handleImportFile} />
    })

  }
  const handleImportFile = (file) => {
    // const file = fileRef.current.files[0]
    // return console.log(file)
    const reader = new FileReader();
    reader.onload = async e => {
      let document = e.target.result
      await authedApi.postStaffImportFile({ data: document })
    }
    reader.readAsArrayBuffer(file);
  }

  const handleExportStaffList = async () => {
    const blob = await authedApi.getStaffExportFile({
      data: {
        group: filter.group,
        location: filter.location,
        credential: filter.credential,
        identity: filter.identity
      }, sort: 'datetime', order: 'desc'
    })
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "staff_list.xlsx")

    document.body.appendChild(link)
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }

  const handleBatchDeleteConfirm = (selected) => {

    getStaffList()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table
          tableKey="STAFF_LIST"
          maxHeight="calc(100vh - 275px)"
          data={rows}
          total={total}
          title="人員管理"
          filter={filter}
          setFilter={setFilter}
          allowSelect
          handleBatchDeleteConfirm={handleBatchDeleteConfirm}
          tableActions={[
            { name: t('add'), onClick: showAddStaffModal, icon: <AddBox /> },
            { name: t('import'), onClick: showImportStaffModal, icon: <Backup /> },
            { name: t('export'), onClick: handleExportStaffList, icon: <CloudDownload /> },
          ]}
          filterComponent={
            <React.Fragment>
              <Select
                style={{ marginLeft: 20 }}
                value={filter.location}
                onChange={e => setFilter({
                  ...filter,
                  location: e.target.value
                })}
                multiple
                label={t('location')}
              >
                {
                  locations
                    .map(location =>
                      <MenuItem
                        key={location.locationid}
                        value={location.locationid}>
                        {location.name}
                      </MenuItem>)
                }
              </Select>
              <Select
                style={{ marginLeft: 20 }}
                value={filter.group}
                onChange={e => setFilter({
                  ...filter,
                  group: e.target.value
                })}
                multiple
                label={t('group')}
              >
                {
                  groups
                    .map(group =>
                      <MenuItem
                        key={group.groupid}
                        value={group.groupid}>
                        {group.name}
                      </MenuItem>)
                }
              </Select>
              <Select
                style={{ marginLeft: 20 }}
                value={filter.identity}
                onChange={e => setFilter({
                  ...filter,
                  identity: e.target.value
                })}
                multiple
                label={t("identity")}
              >
                {
                  identities
                    .map(identity =>
                      <MenuItem
                        key={identity.value}
                        value={identity.value}>
                        {t(identity.value)}
                      </MenuItem>)
                }
              </Select>
              <Select
                style={{ marginLeft: 20 }}
                value={filter.credential}
                onChange={e => setFilter({
                  ...filter,
                  credential: e.target.value
                })}
                multiple
                label={t("credential")}
              >
                {
                  credentials
                    .map(credential =>
                      <MenuItem
                        key={credential.value}
                        value={credential.value}>
                        {t(credential.value)}
                      </MenuItem>)
                }
              </Select>
              <Button
                style={{ marginLeft: 20 }}
                onClick={() => setFilter({
                  ...filter,
                  group: [],
                  location: [],
                  credential: [],
                  identity: []
                })}
                variant="outlined"><Close />清除</Button>
            </React.Fragment>
          }
          columns={[
            { key: "name", label: t('name'), enable: true, sortable: true },
            { key: "photo", label: '頭像', enable: true },
            { key: "faceid", label: t('faceid'), enable: true },
            { key: "cardid", label: t('cardid'), enable: true },
            { key: "vehicleid", label: t('vehicleid'), enable: true },
            { key: "company", label: t('company'), enable: true },
            { key: "department", label: t('department'), enable: true },
            { key: "email", label: t('email'), enable: false },
            // { key: "groups", label: t('group'), enable: false },
            { key: "idcardnumber", label: t('idcardnumber'), enable: false },
            { key: "staffnumber", label: t('staffnumber'), enable: false },
            { key: "note", label: t('note'), enable: false },
          ]}
          actions={[
            { name: t('edit'), onClick: (e, person) => history.push(`/staff/person/${person.staffid}`), icon: <BorderColorSharp /> },
            { name: t('delete'), onClick: (e, row) => showDeteleStaffConfirm(row), icon: <Delete /> },
          ]}
        />
      </Paper>
    </div>
  );
}
