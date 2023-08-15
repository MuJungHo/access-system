import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from "../../components/table/Table";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Select from '../../components/Select';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment'
import {
  IconButton,
} from '@material-ui/core'
import {
  ExitToApp,
  RotateLeft
} from '@material-ui/icons';

import { identities } from "../../utils/constants"

const states = [
  { value: 1, label: "in" },
  { value: 0, label: "out" },]

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
  const { setSnackBar, showModal } = useContext(LayoutContext);
  const { areaid, locationid } = useParams();
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
    (async () => {
      const { result, total } = await authedApi.getAreaStatus({
        ...filter, page: filter.page + 1, areaid
      })

      const tableData = result.map(data => {
        return {
          ...data,
          id: data.id,
        }
      })
      setTotal(total)
      setRows(tableData)

    })();
  }, [filter])

  return (
    <div className={classes.root}>
      <IconButton
        onClick={() => history.push(`/location/${locationid}/area-list`)}>
        <ArrowBackIcon />
      </IconButton>
      <Paper className={classes.paper}>
        <Table
          tableKey="AREA_STATUS"
          data={rows}
          total={total}
          filter={filter}
          setFilter={setFilter}
          columns={[
            { key: 'name', label: t('name'), enable: true },
            { key: 'timestamp', label: t("date"), enable: true },
          ]}
          actions={[]}
        />
      </Paper>
    </div>
  );
}
