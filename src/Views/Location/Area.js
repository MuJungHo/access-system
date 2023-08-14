import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import {
  // Button,
  TextField,
  // Select,
  // MenuItem,
  IconButton
} from '@material-ui/core'

import SimpleTable from "../../components/table/SimpleTable";
import DetailCard from "../../components/DetailCard";

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  Delete,
  BorderColorSharp,
  AddBox
} from '@material-ui/icons';

import GateModalComponent from "../../components/location/GateModalComponent"

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
}));

export default function Location() {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useContext(LocaleContext);
  const { setSnackBar, showModal, hideModal, showWarningConfirm } = useContext(LayoutContext);
  const { areaid, locationid } = useParams();
  const [excludeList, setExcludeList] = React.useState([]);
  const [entryDeviceList, setEntryDeviceList] = React.useState([]);
  const [exitDeviceList, setExitDeviceList] = React.useState([]);
  const [name, setName] = React.useState("")

  const { authedApi } = useContext(AuthContext);

  React.useEffect(() => {
    getArea()
  }, [])

  const getArea = async () => {
    const { result, name } = await authedApi.getArea({ areaid, limit: 50, page: 1 })

    const ids = result.map(area => area.id)

    const _entryDeviceList = result
      .filter(device => device.enter !== null)
      .map(device => ({ ...device, gate: device.enter ? "Entry" : "Exit" }))

    const _exitDeviceList = result
      .filter(device => device.leave !== null)
      .map(device => ({ ...device, gate: device.leave ? "Entry" : "Exit" }))

    setName(name)
    setExcludeList(ids)
    setEntryDeviceList(_entryDeviceList)
    setExitDeviceList(_exitDeviceList)
  }

  const showAddGateModal = (type) => {
    showModal({
      title: "新增" + type,
      component: <GateModalComponent
        authedApi={authedApi}
        excludeList={excludeList}
        type={type}
        gate={{
          id: "",
          [type]: 1
        }}
        onSave={handleAddGate} />
    })
  }

  const showEditGateModal = (e, gate, type) => {
    showModal({
      title: "編輯區域",
      component: <GateModalComponent
        authedApi={authedApi}
        excludeList={excludeList}
        type={type}
        gate={gate}
        onSave={handleEditGate} />
    })
  }

  const handleAddGate = async (state, type) => {
    var _entryDeviceList = entryDeviceList.map(device => ({ id: device.id, enter: device.enter, leave: device.leave }))
    var _exitDeviceList = exitDeviceList.map(device => ({ id: device.id, enter: device.enter, leave: device.leave }))
    var ids = []

    if (type === "enter") {
      ids = [..._exitDeviceList]
      for (let i = 0; i < _entryDeviceList.length; i++) {
        let foundId = ids.find(_id => _id.id === _entryDeviceList[i].id)
        if (foundId === undefined) {
          ids.push({ ..._entryDeviceList[i] })
        } else {
          ids = ids.map(_id => _id.id === _entryDeviceList[i].id
            ? { ..._id, ..._entryDeviceList[i] }
            : { ..._id }
          )
        }
      }
    }
    if (type === "leave") {
      ids = [..._entryDeviceList]
      for (let i = 0; i < _exitDeviceList.length; i++) {
        let foundId = ids.find(_id => _id.id === _exitDeviceList[i].id)
        if (foundId === undefined) {
          ids.push({ ..._exitDeviceList[i] })
        } else {
          ids = ids.map(_id => _id.id === _exitDeviceList[i].id
            ? { ..._id, ..._exitDeviceList[i] }
            : { ..._id }
          )
        }
      }
    }
    let foundId = ids.find(_id => _id.id === state.id)
    if (foundId === undefined) {
      ids.push({ ...state })
    } else {
      ids = ids.map(_id => _id.id === state.id
        ? { ..._id, ...state }
        : { ..._id }
      )
    }

    await authedApi.editArea({
      data: {
        name,
        locationid: Number(locationid),
        ids,
        areaid: Number(areaid)
      }
    })
    getArea()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
    // console.log(entryDeviceList, exitDeviceList)
  }

  const handleEditGate = async (state, type) => {
    var _entryDeviceList = entryDeviceList.map(device => ({ id: device.id, enter: device.enter, leave: device.leave }))
    var _exitDeviceList = exitDeviceList.map(device => ({ id: device.id, enter: device.enter, leave: device.leave }))
    var ids = []
    if (type === "enter") {
      _entryDeviceList = _entryDeviceList.map(device => {
        return device.id === state.id
          ? { ...device, enter: state.enter }
          : { ...device }
      })
      ids = [..._exitDeviceList]
      for (let i = 0; i < _entryDeviceList.length; i++) {
        let foundId = ids.find(_id => _id.id === _entryDeviceList[i].id)
        if (foundId === undefined) {
          ids.push({ ..._entryDeviceList[i] })
        } else {
          ids = ids.map(_id => _id.id === _entryDeviceList[i].id
            ? { ..._id, ..._entryDeviceList[i] }
            : { ..._id }
          )
        }
      }
    }
    if (type === "leave") {
      _exitDeviceList = _exitDeviceList.map(device => {
        return device.id === state.id
          ? { ...device, leave: state.leave }
          : { ...device }
      })
      ids = [..._entryDeviceList]
      for (let i = 0; i < _exitDeviceList.length; i++) {
        let foundId = ids.find(_id => _id.id === _exitDeviceList[i].id)
        if (foundId === undefined) {
          ids.push({ ..._exitDeviceList[i] })
        } else {
          ids = ids.map(_id => _id.id === _exitDeviceList[i].id
            ? { ..._id, ..._exitDeviceList[i] }
            : { ..._id }
          )
        }
      }
    }

    await authedApi.editArea({
      data: {
        name,
        locationid: Number(locationid),
        ids,
        areaid: Number(areaid)
      }
    })
    getArea()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  const showDeleteConfirmDialog = (row, type) => {
    showWarningConfirm({
      title: '刪除資訊',
      component: <h6 style={{ margin: 16 }}>{`確認刪除?`}</h6>,
      onConfirm: () => handleDeleteGate(row, type)
    })
  }

  const handleDeleteGate = async (row, type) => {
    var _entryDeviceList = entryDeviceList.map(device => ({ id: device.id, enter: device.enter }))
    var _exitDeviceList = exitDeviceList.map(device => ({ id: device.id, leave: device.leave }))
    var ids = []

    if (type === "enter") {
      _entryDeviceList = _entryDeviceList.filter(device => device.id !== row.id)
    }
    if (type === "leave") {
      _exitDeviceList = _exitDeviceList.filter(device => device.id !== row.id)
    }

    ids = [..._entryDeviceList, ..._exitDeviceList]

    await authedApi.editArea({
      data: {
        name,
        locationid: Number(locationid),
        ids,
        areaid: Number(areaid)
      }
    })
    getArea()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  const handleEditName = async () => {

    var _entryDeviceList = entryDeviceList.map(device => ({ id: device.id, enter: device.enter }))
    var _exitDeviceList = exitDeviceList.map(device => ({ id: device.id, leave: device.leave }))
    var ids = [..._entryDeviceList, ..._exitDeviceList]

    await authedApi.editArea({
      data: {
        name,
        locationid: Number(locationid),
        ids,
        areaid: Number(areaid)
      }
    })
    getArea()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={() => history.push(`/location/${locationid}/area-list`)}>
        <ArrowBackIcon />
      </IconButton>
      <DetailCard
        title="區域名稱"
        buttonText="儲存"
        onClick={handleEditName}
        style={{ marginBottom: 20 }}>
        <TextField style={{ margin: 20 }} variant="outlined" value={name} onChange={e => setName(e.target.value)} />
      </DetailCard>
      <DetailCard
        title="入口資訊"
        buttonText="新增"
        onClick={() => showAddGateModal("enter")}
        style={{ marginBottom: 20 }}>
        <SimpleTable
          data={entryDeviceList}
          columns={[
            { key: 'name', label: t('name') },
            { key: 'gate', label: "卡機設定" },
          ]}
          actions={[
            { name: t('edit'), onClick: (e, gate) => showEditGateModal(e, gate, "enter"), icon: <BorderColorSharp /> },
            { name: t('delete'), onClick: (e, row) => showDeleteConfirmDialog(row, "enter"), icon: <Delete /> },]}
        />
      </DetailCard>
      <DetailCard
        title="出口資訊"
        buttonText="新增"
        onClick={() => showAddGateModal("leave")}
        style={{ marginBottom: 20 }}>
        <SimpleTable
          data={exitDeviceList}
          columns={[
            { key: 'name', label: t('name') },
            { key: 'gate', label: "卡機設定" },
          ]}
          actions={[
            { name: t('edit'), onClick: (e, gate) => showEditGateModal(e, gate, "leave"), icon: <BorderColorSharp /> },
            { name: t('delete'), onClick: (e, row) => showDeleteConfirmDialog(row, "leave"), icon: <Delete /> },]}
        />
      </DetailCard>
    </div>
  );
}
