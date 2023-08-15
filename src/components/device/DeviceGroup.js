import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import {
  BorderColorSharp,
  Delete,
  AddBox
} from '@material-ui/icons';

import Table from "../../components/table/Table";
import Paper from '@material-ui/core/Paper';
import GroupEditDeviceModalComponent from "../device/GroupEditDeviceModalComponent"

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
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);
  const { showModal, hideModal, setSnackBar, showWarningConfirm } = useContext(LayoutContext);
  const [locations, setLocations] = React.useState([])
  const [rows, setRows] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    order: 'desc',
    orderBy: 'datetime',
    page: 0,
    limit: 5
  })

  React.useEffect(() => {
    (async () => {
      const { result: locationList } = await authedApi.getLocationList({ limit: 50, page: 1 })
      setLocations(locationList)
    })()
  }, [])

  React.useEffect(() => {
    getDeviceGroupList()
  }, [filter])

  const getDeviceGroupList = async () => {
    const { result, total } = await authedApi.getGroupList({ ...filter, page: filter.page + 1 })

    const tableData = result.map(data => {
      return {
        ...data,
        id: data.groupid,
        name: data.name,
        locationid: data.locationid,
        item: data.id?.map(_id => String(_id)) || []
      }
    })
    setTotal(total)
    setRows(tableData)
  }

  const handleShowEditGroupModal = (row) => {
    // console.log(row)
    showModal({
      title: t("edit-thing", { thing: t("device-group") }),
      component: <GroupEditDeviceModalComponent
        group={row}
        authedApi={authedApi}
        locations={locations}
        onSave={handleSaveGroup}
      />
    })
  }

  const handleSaveGroup = async (state, group) => {
    await authedApi.editDeviceGroup({
      data: {
        deviceids: state.item.map(_id => Number(_id)),
        name: state.name,
        locationid: state.locationid,
        groupid: group.groupid
      }
    })
    getDeviceGroupList()
    hideModal()
    setSnackBar({
      message: t("saveSucceed"),
      isOpen: true,
      severity: "success"
    })
  }

  const showAddGroupModal = () => {
    showModal({
      title: t("add-thing", { thing: t("device-group") }),
      component: <GroupEditDeviceModalComponent
        // group={{}}
        authedApi={authedApi}
        locations={locations}
        onSave={handleAddGroup} />
    })
  }

  const handleAddGroup = async (state) => {
    await authedApi.addDeviceGroup({
      data: {
        deviceids: state.item.map(_id => Number(_id)),
        name: state.name,
        locationid: state.locationid
      }
    })
    getDeviceGroupList()
    hideModal()
    setSnackBar({
      message: t("saveSucceed"),
      isOpen: true,
      severity: "success"
    })
  }

  const showDeleteConfirmDialog = (row) => {
    showWarningConfirm({
      title: t("delete-thing", { thing: t("device-group") }),
      component: <h6 style={{ margin: 16 }}>{t("confirm-delete-thing", { thing: row.name })}</h6>,
      onConfirm: () => handleDeleteGroup(row.groupid)
    })
  }

  const handleDeleteGroup = async (groupid) => {
    await authedApi.deleteDeviceGroup({ groupid })
    getDeviceGroupList()
    setSnackBar({
      message: t("deleteSucceed"),
      isOpen: true,
      severity: "success"
    })
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table
          tableKey="DEVICE_GROUP_LIST"
          maxHeight="calc(100vh - 275px)"
          data={rows}
          total={total}
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
            { name: t('delete'), onClick: (e, row) => showDeleteConfirmDialog(row), icon: <Delete /> },
          ]
          }
        />
      </Paper>
    </div>
  );
}
