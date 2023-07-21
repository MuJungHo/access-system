import React, { useContext } from "react";
import { useHistory, useRouteMatch } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import {
  PlayArrow,
  BorderColorSharp,
  FiberManualRecord
} from '@material-ui/icons';

import Table from "../../components/table/Table";
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
      const { result, total } = await authedApi.getStaffList({ ...filter, page: filter.page + 1 })

      const tableData = result.map(data => {
        const card = data.cardid.map(c => (c.uhfnumber && `UHF number  ${c.uhfnumber}`) || (c.mifarenumber && `Mifare number  ${c.mifarenumber}`)) || '--'
        const vehicle = data.vehicleid.map(v => v.vin).join(' ,') || '--'
        const group = data.groups.map(g => g.name).join(' ,') || '--'
        return {
          ...data,
          id: data.staffid,
          card,
          vehicle,
          group,
          groups: undefined,
          cardid: undefined,
          vehicleid: undefined,
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
          maxHeight="calc(100vh - 275px)"
          data={rows}
          total={total}
          title="人員管理"
          filter={filter}
          setFilter={setFilter}
          columns={[
            { key: "name", label: t('name'), enable: true, sortable: true },
            { key: "faceid", label: '頭像', enable: true },
            { key: "cardid", label: '卡片', enable: true },
            { key: "company", label: t('company'), enable: true },
            { key: "department", label: t('department'), enable: true },
            { key: "vehicleid", label: '車輛', enable: true },
            { key: "email", label: t('email'), enable: false },
            { key: "groups", label: t('group'), enable: false },
            { key: "idcardnumber", label: t('idcardnumber'), enable: false },
            { key: "staffnumber", label: t('staffnumber'), enable: false },
            { key: "note", label: t('note'), enable: false },
          ]}
          actions={[
            { name: t('edit'), onClick: (e, person) => history.push(`/person/${person.staffid}`), icon: <BorderColorSharp /> }]}
        />
      </Paper>
    </div>
  );
}
