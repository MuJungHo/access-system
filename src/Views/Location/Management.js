import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from "../../components/table/Table";
import { useHistory } from "react-router-dom"
import {
  PlayArrow,
  BorderColorSharp,
  FiberManualRecord,
  AddBox,
  Delete,
  LocationOn
} from '@material-ui/icons';

import LocationEditModalComponent from "../../components/location/LocationEditModalComponent"

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

export default function Location() {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useContext(LocaleContext);
  const { showModal, hideModal, setSnackBar, showWarningConfirm } = useContext(LayoutContext);
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
    getLocationList()
  }, [filter])

  const getLocationList = async () => {
    const { result, total } = await authedApi.getLocationList({ ...filter, page: filter.page + 1 })

    const tableData = result.map(data => {

      return {
        ...data,
        id: data.locationid,
        name: data.name,
        address: data.address
      }
    })
    setTotal(total)
    setRows(tableData)
  }


  const showAddGroupModal = () => {
    showModal({
      title: "新增位置",
      component: <LocationEditModalComponent
        onSave={handleAddLocation}
      />
    })
  }

  const handleAddLocation = async (state) => {
    await authedApi.addLocation({
      data: {
        name: state.name,
        address: state.address
      }
    })
    getLocationList()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  const handleShowEditLocationModal = (row) => {
    showModal({
      title: "編輯位置",
      component: <LocationEditModalComponent
        location={row}
        onSave={handleSaveLocation}
      />
    })
  }

  const handleSaveLocation = async (state) => {
    await authedApi.editLocation({
      data: {
        name: state.name,
        address: state.address,
        locationid: state.locationid
      }
    })
    getLocationList()
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  const showDeleteConfirmDialog = (row) => {
    showWarningConfirm({
      title: '刪除位置',
      component: <h6 style={{ margin: 16 }}>{`確認刪除位置 ${row.name} ?`}</h6>,
      onConfirm: () => handleDeleteLocation(row.locationid)
    })
  }

  const handleDeleteLocation = async (locationid) => {
    await authedApi.deleteLocation({ locationid })
    getLocationList()
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
          tableKey="LOCATION_LIST"
          data={rows}
          total={total}
          filter={filter}
          setFilter={setFilter}
          tableActions={[
            { name: t('add'), onClick: showAddGroupModal, icon: <AddBox /> },
          ]}
          columns={[
            { key: 'name', label: t('name'), enable: true },
            { key: 'address', label: t('address'), enable: true },
          ]}
          actions={[
            { name: t('edit'), onClick: (e, row) => handleShowEditLocationModal(row), icon: <BorderColorSharp /> },
            { name: 'area', onClick: (e, row) => history.push(`/location/area/${row.locationid}`), icon: <LocationOn /> },
            { name: t('delete'), onClick: (e, row) => showDeleteConfirmDialog(row), icon: <Delete /> },
          ]}
        />
      </Paper>
    </div>
  );
}
