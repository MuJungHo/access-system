import React, { useContext } from "react";
import { useHistory } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from "../../contexts/AuthContext";
import { DeviceContext } from "../../contexts/DeviceContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import {
  PlayArrow,
  BorderColorSharp,
  FiberManualRecord
} from '@material-ui/icons';

import Player from "../../components/Player";
import Table from "../../components/Table";
import Modal from '../../components/Modal';
import VMSEditModalContent from "../../components/device/VMSEditModalContent";

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
  const md5 = require("md5");
  const history = useHistory();
  const { t } = useContext(LocaleContext);
  const [wsData, setWsData] = React.useState({});
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    order: 'asc',
    orderBy: '',
    page: 0,
    limit: 5
  });
  const [playerModal, setPlayerModal] = React.useState({
    playerId: null,
    playerName: null,
    isOpen: false
  });

  const [deviceEditModal, setDeviceEditModal] = React.useState({
    isOpen: false,
    DeviceConfiguration: {
      Category: ""
    }
  });

  const { authedApi, token } = useContext(AuthContext);
  const { DEVICES, setDEVICES } = useContext(DeviceContext);

  React.useEffect(() => {
    (async () => {
      const { result, total } = await authedApi.getDeviceList({ ...filter, page: filter.page + 1 })

      const tableData = result.map(data => ({
        ...data,
        id: data.id,
        ip: data.config.DeviceConfiguration.DeviceSetting.IPAddress,
        status: <FiberManualRecord color="error" />
      }))
      setTotal(total)
      setDEVICES(tableData)

    })();
  }, [authedApi, filter, setDEVICES])

  React.useEffect(() => {
    const timestamp = Date.now()
    const sign = md5(timestamp + '#' + token)
    const wsuri = `ws://${process.env.REACT_APP_DOMAIN}/cgi-bin/message?sign=${sign}&timestamp=${timestamp}`
    let ws = new WebSocket(wsuri);
    ws.onopen = () => console.log('device ws opened');
    ws.onclose = () => console.log('device ws closed');

    ws.onmessage = e => {
      const message = JSON.parse(e.data);
      setWsData(message)
    };

    return () => {
      ws.close();
    }
  }, [md5, token])

  React.useEffect(() => {
    if (wsData['DeviceStatus']) {
      setDEVICES(prevRows => prevRows.map(row => {
        const device = wsData['DeviceStatus'].find(ws => ws.DeviceID === row.deviceid) || {}
        const status = device.Status
        return {
          ...row,
          status: <FiberManualRecord color={status === 'off' ? 'error' : 'secondary'} />
        }
      }))
    }
  }, [wsData, setDEVICES])

  const handleOpenPlayer = (e, device) => {
    e.stopPropagation()
    setPlayerModal({
      isOpen: true,
      playerId: device.deviceid,
      playerName: device.name
    })
  }

  const handleEditDeviceOpen = (e, device) => {
    e.stopPropagation()
    setDeviceEditModal({
      isOpen: true,
      DeviceConfiguration: { ...device.config.DeviceConfiguration },
      id: device.id
    })
  }

  const handleUpdateDevice = async () => {
    await authedApi.editVMSDevice({
      data: {
        DeviceConfiguration: { ...deviceEditModal.DeviceConfiguration }
      },
      id: deviceEditModal.id
    })
    var updatedList = [...DEVICES]
    updatedList = updatedList.map(device =>
      device.id === deviceEditModal.id
        ? {
          ...device,
          name: deviceEditModal.DeviceConfiguration.Name,
          config: {
            DeviceConfiguration: {
              ...deviceEditModal.DeviceConfiguration,
              DeviceSetting: { ...deviceEditModal.DeviceConfiguration.DeviceSetting },
              Ports: { ...deviceEditModal.DeviceConfiguration.Ports },
              Authentication: { ...deviceEditModal.DeviceConfiguration.Authentication }
            },
          },
          ip: deviceEditModal.DeviceConfiguration.DeviceSetting.IPAddress
        }
        : { ...device }
    )
    setDEVICES(updatedList)
    setDeviceEditModal({
      isOpen: false,
      DeviceConfiguration: { DeviceSetting: {}, Ports: {}, Authentication: {} },
      id: null
    })

  }
  return (
    <React.Fragment>
      <Table
        tableKey="DEVICE_LIST"
        data={DEVICES}
        total={total}
        title={t('sider/devices')}
        filter={filter}
        setFilter={setFilter}
        columns={[
          { key: 'status', label: t('status') },
          { key: 'category', label: t('category') },
          { key: 'name', label: t('name') },
          { key: 'ip', label: t('ip') },
        ]}
        actions={[
          { name: t('play'), onClick: handleOpenPlayer, icon: <PlayArrow /> },
          { name: t('edit'), onClick: handleEditDeviceOpen, icon: <BorderColorSharp /> }
        ]}
      />
      <Modal
        title={playerModal.playerName}
        open={playerModal.isOpen}
        maxWidth="lg"
        onClose={() => setPlayerModal({
          playerId: null,
          playerName: null,
          isOpen: false
        })}
      >
        <Player id={playerModal.playerId} />
      </Modal>
      <Modal
        title={'編輯設備'}
        open={deviceEditModal.isOpen}
        maxWidth="sm"
        onConfirm={handleUpdateDevice}
        onClose={() => setDeviceEditModal({
          isOpen: false,
          DeviceConfiguration: { DeviceSetting: {}, Ports: {}, Authentication: {} },
          id: null
        })}>
        {
          {
            "VMS": <VMSEditModalContent deviceEditModal={deviceEditModal} setDeviceEditModal={setDeviceEditModal} />
          }[deviceEditModal.DeviceConfiguration.Category]
        }
      </Modal>
    </React.Fragment>
  );
}
