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
  const { deviceid } = useParams();
  const history = useHistory();
  const [rows, setRows] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    order: 'desc',
    orderBy: 'datetime',
    start: moment().startOf('date').valueOf(),
    end: moment().endOf('date').valueOf(),
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
          identity: t(data.identity?.toLowerCase()),
          photo: data.photo ? <img src={`data:image/png;base64,${data.photo}`} style={{ borderRadius: '50%', height: 50, width: 50 }} onClick={() => {

            showModal({
              title: "相片",
              component: <img src={`data:image/png;base64,${data.photo}`} style={{ display: 'block', margin: 'auto' }} />,
            })
          }} /> : '--',
          timestamp: data.timestamp > 0 ? moment(data.timestamp).format('YYYY-MM-DD hh:mm:ss') : '--',
          status: data.status === 1 ? <ExitToApp color="secondary" /> : '--'
        }
      })
      setTotal(total)
      setRows(tableData)

    })();
  }, [filter])

  const handleResetCardStatus = async (e, row) => {
    await authedApi.postResetDeviceCardStatus({ data: { card_id: [row.id] }, id: deviceid });

    setSnackBar({
      message: "重設成功",
      isOpen: true,
      severity: "success"
    })

    const tableData = rows.filter(row_ => row_.id !== row.id)
    setTotal(total - 1)
    setRows(tableData)
  }
  return (
    <div className={classes.root}>
      <IconButton onClick={() => history.push('/device/management')}><ArrowBackIcon /></IconButton>
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
                label={t('status')}
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
                        {t(identity.value)}
                      </MenuItem>)
                }
              </Select>
            </React.Fragment>
          }
          columns={[
            { key: 'name', label: t('name'), enable: true },
            { key: 'photo', label: t('photo'), enable: true },
            { key: 'identity', label: t('identity'), enable: true },
            { key: 'status', label: t('status'), enable: true },

            // { key: 'code', label: "code", enable: true },
            { key: 'timestamp', label: t("date"), enable: true },
            { key: 'uid', label: t("uid"), enable: true },
          ]}
          actions={[
            { name: t('reset'), onClick: handleResetCardStatus, icon: <RotateLeft /> },
          ]}
        />
      </Paper>
    </div>
  );
}
