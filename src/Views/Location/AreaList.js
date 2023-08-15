import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from "../../components/table/Table";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// import moment from 'moment'
import {
  IconButton,
} from '@material-ui/core'
import {
  ExitToApp,
  MeetingRoom,
  Delete,
  AddBox
} from '@material-ui/icons';

import AreaModalComponent from "../../components/location/AreaModalComponent"

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
  const { t } = useContext(LocaleContext);
  const { showModal, hideModal, setSnackBar, showWarningConfirm } = useContext(LayoutContext);
  const { locationid } = useParams();
  const history = useHistory();
  const [rows, setRows] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    order: 'desc',
    orderBy: 'datetime',
    page: 0,
    limit: 5,
  })
  const { authedApi } = useContext(AuthContext);

  React.useEffect(() => {
    getAreaList()
  }, [filter])

  const getAreaList = async () => {
    const { result, total } = await authedApi.getAreaList({
      ...filter, page: filter.page + 1, locationid
    })
    const tableData = result.map(data => {
      let entrys = []
      let exits = []
      let _entrys = []
      let _exits = []
      if (data.id) {
        for (let i = 0; i < data.id.length; i++) {
          if (data.id[i].leave !== null) {
            exits.push(data.id[i].name)
            _exits.push({
              ...data.id[i],
            })
          }
          if (data.id[i].enter !== null) {
            entrys.push(data.id[i].name)
            _entrys.push({
              ...data.id[i],
            })
          }
        }
      }
      return {
        ...data,
        _id: data.id,
        id: data.areaid,
        exit: exits.join(', '),
        entry: entrys.join(', ')
      }
    })
    setTotal(total)
    setRows(tableData)
  }

  const showDeleteConfirmDialog = (row) => {
    showWarningConfirm({
      title: '刪除位置',
      component: <h6 style={{ margin: 16 }}>{`確認刪除位置 ${row.name} ?`}</h6>,
      onConfirm: () => handleDeleteArea(row.areaid)
    })
  }

  const handleDeleteArea = async (areaid) => {
    await authedApi.deleteArea({ areaid })
    getAreaList()
    setSnackBar({
      message: "刪除成功",
      isOpen: true,
      severity: "success"
    })
  }

  const showAddAreaModal = () => {
    showModal({
      title: "新增區域",
      component: <AreaModalComponent
        onSave={handleAddArea} />
    })
  }
  const handleAddArea = async (name) => {
    await authedApi.addArea({ data: { name, locationid: Number(locationid) } })
    getAreaList()
    hideModal()
    setSnackBar({
      message: "新增成功",
      isOpen: true,
      severity: "success"
    })
  }
  return (
    <div className={classes.root}>
      <IconButton onClick={() => history.push('/location/management')}><ArrowBackIcon /></IconButton>
      <Paper className={classes.paper}>
        <Table
          tableKey="AREA_LIST"
          data={rows}
          total={total}
          filter={filter}
          setFilter={setFilter}
          tableActions={[
            { name: t('add'), onClick: showAddAreaModal, icon: <AddBox /> },
          ]}
          columns={[
            { key: 'name', label: t('name') },
            { key: 'entry', label: t('entry') },
            { key: 'exit', label: t('exit') },
          ]}
          actions={[
            { name: t('edit'), onClick: (e, row) => history.push(`/location/${locationid}/area/${row.areaid}`), icon: <ExitToApp /> },
            { name: "進出", onClick: (e, row) => history.push(`/location/${locationid}/area-status/${row.areaid}`), icon: <MeetingRoom /> },
            { name: t('delete'), onClick: (e, row) => showDeleteConfirmDialog(row), icon: <Delete /> },
          ]}
        />
      </Paper>
    </div>
  );
}
