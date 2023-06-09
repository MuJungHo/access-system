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

export default function Cards() {
  const classes = useStyles();
  const { t } = useContext(LocaleContext);
  const [rows, setRows] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    order: 'asc',
    orderBy: 'datetime',
    start: moment().startOf('date').valueOf(),
    end: moment().endOf('date').valueOf(),
    page: 0,
    limit: 5
  })
  const { authedApi } = useContext(AuthContext);

  React.useEffect(() => {
    (async () => {
      const { result, total } = await authedApi.getNewCardList({ ...filter, page: filter.page + 1 })

      const tableData = result.map(data => {
        return {
          ...data,
          id: data.id,
          applyTime: moment(data.datetime).format('YYYY-MM-DD hh:mm:ss'),
          photo: <img width={100} height={100} src={`data:image/png;base64,${data.photo}`} alt="" />
          //   card,
          //   vehicle,
          //   group
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
          tableKey="CARD_LIST"
          data={rows}
          total={total}
          title={t('sider/card')}
          filter={filter}
          setFilter={setFilter}
          columns={[
            { key: 'name', label: t('name') },
            { key: 'photo', label: t('photo') },
            { key: 'company', label: t('company') },
            { key: 'applyTime', label: t('applyTime') },
            { key: 'location', label: t('location') },
          ]}
          actions={[]}
        />
      </Paper>
    </div>
  );
}
