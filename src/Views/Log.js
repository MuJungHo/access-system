import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { LocaleContext } from "../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import moment from 'moment'
import Table from "../components/Table";

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
  const { t } = useContext(LocaleContext);
  const [rows, setRows] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    order: 'desc',
    orderBy: 'datetime',
    start: moment().startOf('date').valueOf(),
    end: moment().endOf('date').valueOf(),
    page: 0,
    limit: 5
  })
  const { authedApi } = useContext(AuthContext);

  React.useEffect(() => {
    (async () => {
      const { result, total } = await authedApi.getLogList({ ...filter, page: filter.page + 1 })

      const tableData = result.map(data => {
        return {
          ...data,
          id: data.logid,
          condition: data.condition,
          detail: data.detail,
          accountname: data.accountname,
          rolename: data.rolename,
          datetime: moment(data.createtime).format('YYYY-MM-DD hh:mm:ss'),
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
          tableKey="LOG_LIST"
          data={rows}
          total={total}
          title={t('sider/log')}
          filter={filter}
          setFilter={setFilter}
          dateRangePicker
          columns={[
            { key: 'datetime', label: t('date'), enable: true },
            { key: 'condition', label: t('condition'), enable: true },
            { key: 'detail', label: t('detail'), enable: true },
            { key: 'accountname', label: t('account'), enable: true },
            { key: 'rolename', label: t('role') },
            // { key: 'location', label: t('location') },
          ]}
        // actions={[]}
        />
      </Paper>
    </div>
  );
}
