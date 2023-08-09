import React, { useContext } from "react";
import { useHistory, useRouteMatch } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import {
  PlayArrow,
  BorderColorSharp,
  FiberManualRecord,
  AddBox,
  Delete
} from '@material-ui/icons';

import Table from "../../components/table/Table";
import Paper from '@material-ui/core/Paper';
import GroupEditModalComponent from "../staff/GroupEditModalComponent"

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
  const { showModal, hideModal, setSnackBar, showWarningConfirm } = useContext(LayoutContext);
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

  React.useEffect(() => {
    (async () => {
      const { result } = await authedApi.getLocationList({ limit: 50, page: 1 })
      setLocations(result)
    })()
  }, [])

  React.useEffect(() => {
    getStaffGroupList()
  }, [filter])

  const getStaffGroupList = async () => {
    const { result, total } = await authedApi.getStaffGroupList({ ...filter, page: filter.page + 1 })

    const tableData = result.map(data => {
      return {
        ...data,
        id: data.staffgroupid,
        name: data.name,
        locationid: data.locationid,
        item: data.staffids?.map(_id => String(_id)) || []
      }
    })
    setTotal(total)
    setRows(tableData)
  }

  const showAddGroupModal = () => {
    showModal({
      title: "新增群組",
      component: <GroupEditModalComponent
        // group={{}}
        authedApi={authedApi}
        locations={locations}
        onSave={handleAddGroup}
      />
    })
  }

  const handleAddGroup = async (state) => {
    await authedApi.addStaffGroup({
      data: {
        staffids: state.item.map(_id => Number(_id)),
        name: state.name,
        locationid: state.locationid
      }
    })
    getStaffGroupList()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  const handleShowEditGroupModal = (row) => {
    showModal({
      title: "編輯設備群組",
      component: <GroupEditModalComponent
        group={row}
        authedApi={authedApi}
        locations={locations}
        onSave={handleSaveGroup}
      />
    })
  }

  const handleSaveGroup = async (state, group) => {
    await authedApi.editStaffGroup({
      data: {
        staffids: state.item.map(_id => Number(_id)),
        name: state.name,
        locationid: state.locationid,
        staffgroupid: group.staffgroupid
      }
    })
    getStaffGroupList()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  const showDeleteConfirmDialog = (row) => {
    showWarningConfirm({
      title: '刪除人員群組',
      component: <h6 style={{ margin: 16 }}>{`確認刪除群組 ${row.name} ?`}</h6>,
      onConfirm: () => handleDeleteGroup(row.staffgroupid)
    })
  }

  const handleDeleteGroup = async (staffgroupid) => {
    await authedApi.deleteStaffGroup({ staffgroupid })
    getStaffGroupList()
    setSnackBar({
      message: "刪除成功",
      isOpen: true,
      severity: "success"
    })
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table
          tableKey="STAFF_GROUP_LIST"
          maxHeight="calc(100vh - 275px)"
          data={rows}
          total={total}
          title="人員群組"
          filter={filter}
          setFilter={setFilter}
          tableActions={[
            { name: t('add'), onClick: showAddGroupModal, icon: <AddBox /> },
          ]}
          columns={[
            { key: "name", label: t('name'), enable: true, sortable: true },
            { key: "locationid", label: t('locationid'), enable: true },
          ]}
          actions={[
            { name: t('edit'), onClick: (e, row) => handleShowEditGroupModal(row), icon: <BorderColorSharp /> },
            { name: t('delete'), onClick: (e, row) => showDeleteConfirmDialog(row), icon: <Delete /> },]}
        />
      </Paper>
    </div>
  );
}
