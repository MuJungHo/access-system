import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { LocaleContext } from "../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from "../components/table/Table";

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

    })();
  }, [authedApi, filter])

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table
          tableKey="LOCATION_LIST"
          data={rows}
          total={total}
          title={t('sider/location')}
          filter={filter}
          setFilter={setFilter}
          columns={[
            { key: 'name', label: t('name'), enable: true },
            { key: 'address', label: t('address'), enable: true },
          ]}
          actions={[]}
        />
      </Paper>
    </div>
  );
}
