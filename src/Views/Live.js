import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';

import {
  Paper,
  // Divider,
  Button,
  TextField,
  Drawer,
  TablePagination,
  ButtonGroup
} from '@material-ui/core'

import {
  Videocam,
  Notifications,
  Dashboard,
  GridOff,
  BorderAllRounded,
  LooksOne,
  FiberManualRecord,
  CropDin,
  CheckBoxOutlineBlankTwoTone
} from '@material-ui/icons';
import Player from "../components/live/Player"
import SearchTextField from '../components/common/SearchTextField'
import Tab from '../components/common/Tab';
import Tabs from "../components/common/Tabs"
import { LocaleContext } from "../contexts/LocaleContext";
import { AuthContext } from "../contexts/AuthContext";
import { palette } from "../customTheme";
import moment from "moment";

const viewBackgroundColor = "#e5e5e5"

const leftLimit = 7

const useStyles = makeStyles(() => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  },
  content: {
    display: 'flex',
    height: 'calc(100vh - 100px)',
  },
  right: {
    flex: 1,
    backgroundColor: viewBackgroundColor,
    display: 'flex',
    flexDirection: 'column',
  },
  contentRightTop: {
    paddingTop: 12,
    paddingLeft: 12
  },
  contentInnerRight: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 12,
  },
  contentInnerItem: {
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 8,
    // marginRight: 8,
    marginTop: 8,
    borderRadius: 5
  },
  left: {
    width: 350,
    display: 'flex',
    flexDirection: 'column',
  },
  leftContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: 12
  },
  leftContentInner: {
    backgroundColor: viewBackgroundColor,
    // height: '100%',
    //padding: 12,
    flex: 1,
  },
  leftContentInnerItem: {
    height: 50,
    backgroundColor: '#fff',
    margin: 8,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 5,
    cursor: "pointer"
  },
}));

const Live = () => {
  const classes = useStyles();
  const md5 = require("md5");
  const token = localStorage.getItem('token')
  const { t } = React.useContext(LocaleContext);
  const { authedApi } = React.useContext(AuthContext);
  const [leftTabIndex, setLeftTabIndex] = React.useState(0);
  const [playerlist, setPlayerlist] = React.useState([
    { playerid: 'player1', device: { _id: "" } },
    { playerid: 'player2', device: { _id: "" } },
    { playerid: 'player3', device: { _id: "" } },
    { playerid: 'player4', device: { _id: "" } },
  ])
  const [wsData, setWsData] = React.useState({})

  const [isGrid, setGrid] = React.useState(true)
  const [count, setCount] = React.useState(4);
  const [leftFilter, setLeftFilter] = React.useState({
    page: 0,
    keyword: ""
  });
  const [leftTotal, setLeftTotal] = React.useState(0)

  const [selectedPlayer, setSelectedPlayer] = React.useState({ playerid: 'player1', device: { _id: "" } })
  const [selectedDevice, setSelectedDevice] = React.useState({ _id: "" })
  const [leftItems, setLeftItems] = React.useState([])
  const [events, setEvents] = React.useState([])

  React.useEffect(() => {
    const timestamp = Date.now()
    const sign = md5(timestamp + '#' + token)
    const wsuri = `ws://${process.env.REACT_APP_DOMAIN}/cgi-bin/message?sign=${sign}&timestamp=${timestamp}`
    let ws = new WebSocket(wsuri);
    ws.onopen = () => console.log('event ws opened');
    ws.onclose = () => console.log('event ws closed');
    ws.onmessage = e => {
      const message = JSON.parse(e.data);
      setWsData(message)
    };

    getDeviceList()

    return () => {
      ws.close();
    }
  }, [])

  React.useEffect(() => {
    if (wsData['Event']) {
      setEvents(prevEvents => {
        const prevEvents_ = [...prevEvents]
        // if (wsData['Event'].Level === 3) 
        prevEvents_.push({ ...wsData['Event'] })
        return prevEvents_
      })
    }
    if (wsData['DeviceStatus']) {
      setLeftItems(prevRows => prevRows.map(row => {
        const device = wsData['DeviceStatus'].find(ws => ws.DeviceID === row.deviceid) || {}
        const status = device.Status
        return {
          ...row,
          status
        }
      }))
    }
  }, [wsData])

  React.useEffect(() => {
    setSelectedPlayer({ playerid: "player1", device: { _id: "" } })
    setSelectedDevice({ _id: "" })
    if (count === 4) {
      setPlayerlist([
        { playerid: 'player1', device: { _id: "" } },
        { playerid: 'player2', device: { _id: "" } },
        { playerid: 'player3', device: { _id: "" } },
        { playerid: 'player4', device: { _id: "" } },
      ])
    } else if (count === 3) {
      setPlayerlist([
        { playerid: 'player1', device: { _id: "" } },
        { playerid: 'player2', device: { _id: "" } },
        { playerid: 'player3', device: { _id: "" } },
      ])
    }else if (count === 2) {
      setPlayerlist([
        { playerid: 'player1', device: { _id: "" } },
        { playerid: 'player2', device: { _id: "" } },
      ])
    }else if (count === 1) {
      setPlayerlist([
        { playerid: 'player1', device: { _id: "" } },
      ])
    }
  }, [count])

  const handleDeletePlayer = (playerid) => {
    let newPlayList = [...playerlist]
    newPlayList = newPlayList.map(_player => _player.playerid === playerid
      ? { playerid, device: { _id: "" } }
      : { ..._player }
    )
    setPlayerlist(newPlayList)
    setSelectedPlayer({ playerid: "", device: { _id: "" } })
    setSelectedDevice({ _id: "" })
  }

  const getDeviceList = async ({ page = 0, keyword = "", limit = leftLimit, groupid = "" } = {}) => {
    const { result, total } = await authedApi.getDeviceList({ page: page + 1, keyword, limit, groupid, category: "VMSIPC" })
    const _devices = result.map(data => {
      return {
        ...data,
        _id: data.deviceid,
        status: ''
      }
    })
    setLeftTotal(total)
    setLeftItems(_devices)
  }

  const handleCheckDevice = (item) => {
    let newPlayList = [...playerlist]
    newPlayList = newPlayList.map(_player => _player.playerid === selectedPlayer.playerid
      ? { ..._player, device: { ...item } }
      : { ..._player }
    )
    setSelectedDevice({ ...item })
    setPlayerlist(newPlayList)
  }

  const handleCheckPlayer = (item) => {
    setSelectedPlayer(item)
    setSelectedDevice(item.device)
  }

  const DeviceList = () => {
    return (
      <React.Fragment>
        <SearchTextField style={{ flex: 'unset' }} placeholder={t("search-keyword")} />
        <div style={{ height: 20 }}></div>
        <div className={classes.leftContentInner}>
          {
            leftItems.map(item => (
              <div
                style={selectedDevice._id === item._id ? { border: '3px solid' + palette.primary.main } : { border: '3px solid white' }}
                className={classes.leftContentInnerItem}
                onClick={() => handleCheckDevice(item)}
                key={item._id}>
                <FiberManualRecord style={{ margin: 10, color: item.status === "on" ? palette.secondary.main : palette.error.main }} />
                <span style={{ flex: 1 }}>{item.name}</span>
                <img src={`data:image/png;base64,${item.snapshot}`} style={{ height: 30, marginRight: 8 }} />
              </div>
            ))
          }
        </div>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={leftTotal}
          rowsPerPage={leftLimit}
          page={leftFilter.page}
          onPageChange={(event, newPage) => { }}
        />
      </React.Fragment>)
  }

  const EventList = () => {

    return (
      <div className={classes.leftContentInner}>
        {
          events.map((event, i) =>
            <div style={{
              color: event.Level === 3 ? palette.error.main : '',
              margin: 8
            }} key={i}><h7 >
                {`
                ${moment(event.DateTime).format('YYYY-MM-DD hh:mm:ss')}
                ${event.Identity}
                ${event.Name}
                ${event.camerabind && `( ${event.camerabind[0].name} )`}
              `}
              </h7></div>)
        }
      </div>

    )
  }
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.left}>
          <Tabs
            value={leftTabIndex}
            TabIndicatorProps={{ style: { background: 'white' } }}
            onChange={(event, newValue) => {
              setLeftTabIndex(newValue);
            }}
            variant="fullWidth"
            textColor="primary"
          >
            <Tab icon={<Videocam />} />
            <Tab icon={<Notifications />} />
          </Tabs>
          <Paper className={classes.leftContent}>
            {
              {
                0: <DeviceList />,
                1: <EventList />
              }[leftTabIndex]
            }
          </Paper>
        </div>
        <div className={classes.right}>
          <div className={classes.contentRightTop}>
            <ButtonGroup
              // color="primary"
              variant="outlined"
              size="large">
              <Button onClick={() => setGrid(true)}><BorderAllRounded color={isGrid ? 'primary' : 'inherit'} /></Button>
              <Button onClick={() => setGrid(false)}><CheckBoxOutlineBlankTwoTone color={isGrid ? 'inherit' : 'primary'} /></Button>
            </ButtonGroup>
          </div>
          <div className={classes.contentInnerRight}>
            {
              playerlist.map(player =>
                <Player
                  isSelected={player.playerid === selectedPlayer.playerid}
                  key={player.playerid}
                  player={player}
                  isGrid={isGrid}
                  handleCheckPlayer={() => handleCheckPlayer(player)}
                  onDelete={() => handleDeletePlayer(player.playerid)}
                />)
            }
          </div>
        </div>
      </div>
    </div >
  );
}


export default Live;