import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { LocaleContext } from "../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import moment from 'moment'
import Table from "../components/Table";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { palette } from '../customTheme'

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
      const { result, total } = await authedApi.getEventList({ ...filter, page: filter.page + 1 })

      const tableData = result.map(data => {
        return {
          ...data,
          id: data.eventid,
          datetime: moment(data.createtime).format('YYYY-MM-DD hh:mm:ss'),
          description: data.description,
          category: data.category,
          level: <FiberManualRecordIcon style={{ color: {
            1: palette.secondary.main,
            2: palette.warning.main,
            3: palette.error.main
          }[data.level]}}/>
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
          tableKey="EVENT_LIST"
          data={rows}
          total={total}
          title={t('sider/event')}
          filter={filter}
          setFilter={setFilter}
          dateRangePicker
          columns={[
            { key: 'datetime', label: t('date'), enable: true },
            { key: 'level', label: t('level'), enable: true },
            { key: 'name', label: t('name'), enable: true },
            { key: 'category', label: t('category'), enable: true },
            { key: 'description', label: t('description') },
            // { key: 'location', label: t('location') },
          ]}
          // actions={[]}
        />
      </Paper>
    </div>
  );
}
