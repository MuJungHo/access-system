import React, { useContext } from "react";
import { useHistory } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import {
  BorderColorSharp
} from '@material-ui/icons';

import Table from "../../components/Table";

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
      const { result, total } = await authedApi.getPersonList({ ...filter, page: filter.page + 1 })

      const tableData = result.map(data => {
        const card = data.cardid.map(c => (c.uhfnumber && `UHF number  ${c.uhfnumber}`) || (c.mifarenumber && `Mifare number  ${c.mifarenumber}`)) || '--'
        const vehicle = data.vehicleid.map(v => v.vin).join(' ,') || '--'
        const group = data.groups.map(g => g.name).join(' ,') || '--'
        return {
          ...data,
          id: data.staffid,
          card,
          vehicle,
          group
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
          tableKey="STAFF_LIST"
          data={rows}
          total={total}
          title={t('sider/people')}
          filter={filter}
          setFilter={setFilter}
          columns={[
            { key: 'name', label: t('name') },
            { key: 'card', label: t('card') },
            { key: 'vehicle', label: t('vehicle') },
            { key: 'group', label: t('group') },
          ]}
          actions={[
            { name: t('edit'), onClick: (e, person) => history.push(`/person/${person.staffid}`), icon: <BorderColorSharp /> }]}
        />
      </Paper>
    </div>
  );
}
