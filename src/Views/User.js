import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { LocaleContext } from "../contexts/LocaleContext";
import { LayoutContext } from "../contexts/LayoutContext";
import { getKey } from '../utils/apis';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from "../components/table/Table";
import UserModalComponent from "../components/user/UserModalComponent";
import PermissionModalComponent from "../components/user/PermissionModalComponent";

import {
  Delete,
  ExitToApp,
  AddBox,
  PermContactCalendar
} from '@material-ui/icons';

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

export default function Event() {
  const classes = useStyles();
  const CryptoJS = require("crypto-js");
  const { t } = useContext(LocaleContext);
  const [locations, setLocations] = React.useState([])
  const [rows, setRows] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    order: 'desc',
    orderBy: 'datetime',
    page: 0,
    limit: 5
  })
  const { authedApi } = useContext(AuthContext);
  const { setSnackBar, showModal, hideModal, showWarningConfirm } = useContext(LayoutContext);

  React.useEffect(() => {
    getUserList()
  }, [filter])


  React.useEffect(() => {
    (async () => {
      const { result } = await authedApi.getLocationList({ page: 1, limit: 50 })
      setLocations(result)
    })();
  }, [])

  const getUserList = async () => {

    const { result, total } = await authedApi.getUserList({
      ...filter, page: filter.page + 1,
      order: 'desc',
      orderBy: 'datetime',
    })

    const tableData = result.map(data => {
      const location = data.locations.map(l => l.location_name).join(' ,') || '--'
      return {
        ...data,
        id: data.accountid,
        name: data.name,
        email: data.email,
        rolename: data.rolename,
        location: data.roleid === 1 ? '--' : location,
        _locations: data.locations.map(location => String(location.locationid))
      }
    })
    setTotal(total)
    setRows(tableData)
  }


  const handleShowEditPermissionModal = (row) => {
    showModal({
      title: "編輯使用者權限",
      component: <PermissionModalComponent
        user={row}
        permission={row.permission}
        onSave={handleSavePermission} />
    })
  }

  const handleSavePermission = async (state, accountid) => {

    let permissions = [
      { name: "device" },
      { name: "event" },
      { name: "log" },
      { name: "home" },
      { name: "account" },
      { name: "staff" },
      { name: "access" },
      { name: "setting" },
      { name: "building" },
      { name: "bell" },
      { name: "info" },
      { name: "video" },
    ]
    permissions = permissions.map((p, position) => ({
      name: p.name,
      position,
      enable: state.includes(p.name)
    }))
    await authedApi.editAccountPermission({
      data: {
        accountid,
        permission: JSON.stringify(permissions)
      }
    })
    getUserList()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  const handleShowEditUserModal = (row) => {
    // console.log(row)
    showModal({
      title: "編輯使用者",
      component: <UserModalComponent
        user={row}
        locations={locations}
        onSave={handleSaveUser} />
    })
  }

  const showAddStaffModal = () => {
    showModal({
      title: "新增使用者",
      component: <UserModalComponent
        user={{}}
        locations={locations} onSave={handleAddUser} />
    })
  }

  const handleAddUser = async (state) => {
    const aesEncryptPassword = await getAESEncrypt(state.password)
    await authedApi.addAccount({
      data: {
        // accountid: state.accountid,
        email: state.email,
        locations: state._locations.map(location => Number(location)),
        name: state.name,
        password: aesEncryptPassword,
        roleid: state.roleid,
        permission: null
      }
    })
    getUserList()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }


  const getAESEncrypt = async (txt) => {
    const timestamp = Date.now();
    const { secretkey } = await getKey({ timestamp });
    const cipher = CryptoJS.AES.encrypt(
      txt,
      CryptoJS.enc.Utf8.parse(secretkey),
      {
        iv: CryptoJS.enc.Utf8.parse(""),
        mode: CryptoJS.mode.ECB
      }
    )
    return cipher.toString()
  }

  const handleSaveUser = async (state) => {
    const aesEncryptPassword = await getAESEncrypt(state.password)
    await authedApi.editAccount({
      data: {
        accountid: state.accountid,
        email: state.email,
        locations: state._locations.map(location => Number(location)),
        name: state.name,
        password: aesEncryptPassword,
        roleid: state.roleid
      }
    })
    getUserList()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  const showDeleteConfirmDialog = (row) => {
    showWarningConfirm({
      title: '刪除使用者',
      component: <h6 style={{ margin: 16 }}>{`確認刪除 ${row.name} ?`}</h6>,
      onConfirm: () => handleDeleteUser(row.accountid)
    })
  }

  const handleDeleteUser = async (accountid) => {
    await authedApi.deleteAccount({ accountid })
    getUserList()
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
          tableKey="USER_LIST"
          data={rows}
          total={total}
          title={t('sider/user')}
          filter={filter}
          setFilter={setFilter}
          tableActions={[
            { name: t('add'), onClick: showAddStaffModal, icon: <AddBox /> },
          ]}
          columns={[
            { key: 'name', label: t('account'), enable: true },
            { key: 'email', label: t('email'), enable: true },
            { key: 'rolename', label: t('role'), enable: true },
            { key: 'location', label: t('location'), width: '25%' },
          ]}
          actions={[
            { name: t('edit'), onClick: (e, row) => handleShowEditUserModal(row), icon: <ExitToApp /> },
            { name: "權限", onClick: (e, row) => handleShowEditPermissionModal(row), icon: <PermContactCalendar /> },
            { name: t('delete'), onClick: (e, row) => showDeleteConfirmDialog(row), icon: <Delete /> },
          ]}
        />
      </Paper>
    </div>
  );
}
