import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { makeStyles } from '@material-ui/core/styles';
import Table from "../../components/table/Table";
import VisitorPointModalComponent from "../../components/location/VisitorPointModalComponent";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  IconButton,
  Paper
} from '@material-ui/core'
import {
  BorderColorSharp,
  Delete,
  AddBox
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

export default function Location() {
  const classes = useStyles();
  const { t } = useContext(LocaleContext);
  const { setSnackBar, showModal, hideModal, showWarningConfirm } = useContext(LayoutContext);
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
    getVisitorPointList()
  }, [filter])

  const getVisitorPointList = async () => {
    const { result, total } = await authedApi.getVisitorPointList({
      ...filter, page: filter.page + 1, locationid
    })

    const tableData = result.map(data => {
      return {
        ...data,
        id: data.vgid,
        item: data.staffgroupid?.map(_id => String(_id)) || []
      }
    })
    setTotal(total)
    setRows(tableData)
  }

  const showAddVisitorPointModal = () => {
    showModal({
      title: t("add-thing", { thing: t("visitorpoint") }),
      component: <VisitorPointModalComponent
        authedApi={authedApi}
        // visitorpoint={{}}
        onSave={handleAddVisitorPoint}
      />
    })
  }

  const handleAddVisitorPoint = async (state) => {
    await authedApi.addVisitorPoint({
      data: {
        name: state.name,
        locationid: Number(locationid),
        staffgroupids: state.item.map(_id => Number(_id))
      }
    })
    getVisitorPointList()
    hideModal()
    setSnackBar({
      message: t("saveSucceed"),
      isOpen: true,
      severity: "success"
    })
  }

  const handleShowEditVisitorPointModal = (row) => {
    showModal({
      title: t("edit-thing", { thing: t("visitorpoint") }),
      component: <VisitorPointModalComponent
        authedApi={authedApi}
        visitorpoint={row}
        onSave={handleSaveVisitorPoint}
      />
    })
  }

  const handleSaveVisitorPoint = async (state) => {
    await authedApi.editVisitorPoint({
      data: {
        vgid: state.vgid,
        name: state.name,
        locationid: Number(locationid),
        staffgroupids: state.item.map(_id => Number(_id))
      }
    })
    getVisitorPointList()
    hideModal()
    setSnackBar({
      message: t("saveSucceed"),
      isOpen: true,
      severity: "success"
    })
  }

  const showDeleteConfirmDialog = (row) => {
    showWarningConfirm({
      title: t("delete-thing", { thing: t("visitorpoint") }),
      component: <h6 style={{ margin: 16 }}>{t("confirm-delete-thing", { thing: row.name })}</h6>,
      onConfirm: () => handleDeleteVisitorPoint(row.vgid)
    })
  }

  const handleDeleteVisitorPoint = async (vgid) => {
    await authedApi.deleteVisitorPoint({ vgid })
    getVisitorPointList()
    setSnackBar({
      message: t("deleteSucceed"),
      isOpen: true,
      severity: "success"
    })
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={() => history.push(`/location/management`)}>
        <ArrowBackIcon />
      </IconButton>
      <Paper className={classes.paper}>
        <Table
          tableKey="VISITOR_POINT"
          data={rows}
          total={total}
          filter={filter}
          setFilter={setFilter}
          tableActions={[
            { name: t('add'), onClick: showAddVisitorPointModal, icon: <AddBox /> },
          ]}
          columns={[
            { key: 'name', label: t('name'), enable: true },
          ]}
          actions={[
            { name: t('edit'), onClick: (e, row) => handleShowEditVisitorPointModal(row), icon: <BorderColorSharp /> },
            { name: t('delete'), onClick: (e, row) => showDeleteConfirmDialog(row), icon: <Delete /> },
          ]}
        />
      </Paper>
    </div>
  );
}
