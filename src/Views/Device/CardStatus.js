import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from "../../components/table/Table";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Select from '../../components/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
  IconButton
} from '@material-ui/core'

const identities = [
  { value: "staff", label: "staff" },
  { value: "guest", label: "guest" },
  { value: "vip", label: "vip" },
  { value: "blacklist", label: "blacklist" },
  { value: "stranger", label: "stranger" },
]

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
  const { deviceid } = useParams();
  const history = useHistory();
  const [rows, setRows] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    order: 'desc',
    orderBy: 'datetime',
    page: 0,
    limit: 5,
    identity: [],
    status: []
  })
  const { authedApi } = useContext(AuthContext);

  React.useEffect(() => {
    (async () => {
      const { result, total } = await authedApi.getDeviceCardStatusList({
        data: {
          identity: filter.identity,
          status: filter.status
        },
        ...filter, page: filter.page + 1, id: deviceid, identity: undefined, status: undefined
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
  }, [authedApi, filter])

  return (
    <div className={classes.root}>
      <IconButton onClick={() => history.push('/device/list')}><ArrowBackIcon /></IconButton>
      <Paper className={classes.paper}>
        <Table
          tableKey="CARD_STATUS"
          data={rows}
          total={total}
          filter={filter}
          setFilter={setFilter}
          dateRangePicker
          filterComponent={
            <React.Fragment>
              <Select
                style={{ marginLeft: 20 }}
                value={filter.status}
                onChange={e => setFilter({
                  ...filter,
                  status: e.target.value
                })}
                multiple
                label={"status"}
              >
                {
                  states
                    .map(status =>
                      <MenuItem
                        key={status.value}
                        value={status.value}>
                        {status.label}
                      </MenuItem>)
                }
              </Select>
              <Select
                style={{ marginLeft: 20 }}
                value={filter.identity}
                onChange={e => setFilter({
                  ...filter,
                  identity: e.target.value
                })}
                multiple
                label={t("identity")}
              >
                {
                  identities
                    .map(identity =>
                      <MenuItem
                        key={identity.value}
                        value={identity.value}>
                        {identity.label}
                      </MenuItem>)
                }
              </Select>
            </React.Fragment>
          }
          columns={[
            { key: 'name', label: t('name'), enable: true },
            { key: 'identity', label: t('identity'), enable: true },
            { key: 'code', label: "code", enable: true },
            { key: 'timestamp', label: "timestamp", enable: true },
            { key: 'uid', label: t("uid"), enable: true },
          ]}
          actions={[]}
        />
      </Paper>
    </div>
  );
}
