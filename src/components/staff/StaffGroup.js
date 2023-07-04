import React, { useContext } from "react";
import { useHistory, useRouteMatch } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from "../../contexts/AuthContext";
import { DeviceContext } from "../../contexts/DeviceContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import {
  PlayArrow,
  BorderColorSharp,
  FiberManualRecord
} from '@material-ui/icons';

import Table from "../../components/Table";
import Paper from '@material-ui/core/Paper';

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
  const [rows, setRows] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    order: 'asc',
    orderBy: 'datetime',
    page: 0,
    limit: 5
  })
  const { authedApi } = useContext(AuthContext);

  React.useEffect(() => {
    (async () => {
      const { result, total } = await authedApi.getStaffGroupList({ ...filter, page: filter.page + 1 })

      const tableData = result.map(data => {
        return {
          id: data.staffgroupid,
          name: data.name,
          locationid: data.locationid,
        }
      })
      setTotal(total)
      setRows(tableData)

    })();
  }, [authedApi, filter])


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
          columns={[
            { key: "name", label: t('name'), enable: true, sortable: true },
            { key: "locationid", label: t('locationid'), enable: true },
          ]}
        //   actions={[
        //     { name: t('edit'), onClick: (e, person) => history.push(`/person/${person.staffid}`), icon: <BorderColorSharp /> }]}
        />
      </Paper>
    </div>
  );
}
