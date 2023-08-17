import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Player from "./Player"

import {
  Paper,
  // Divider,
  Button,
  TextField,
  MenuItem,
  TablePagination
} from '@material-ui/core'
import VideocamIcon from '@material-ui/icons/Videocam';
import Text from "../Text"
import SearchTextField from '../common/SearchTextField'
import { LocaleContext } from "../../contexts/LocaleContext";
import { AuthContext } from "../../contexts/AuthContext";
import { palette } from "../../customTheme";

const viewBackgroundColor = "#e5e5e5"

const leftLimit = 7
const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  },
  content: {
    display: 'flex',
    height: 'calc(100vh - 60px)',
  },
  contentInnerLeft: {
    backgroundColor: viewBackgroundColor,
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
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
  leftContent: {
    width: 350,
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
    flex: 1,
    marginTop: 20
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

export default ({ authedApi }) => {
  const classes = useStyles();
  const { t } = React.useContext(LocaleContext);
  const [playerlist, setPlayerlist] = React.useState([
    { playerid: 'player1', device: { _id: "" } },
    { playerid: 'player2', device: { _id: "" } },
    { playerid: 'player3', device: { _id: "" } },
    { playerid: 'player4', device: { _id: "" } },
  ])

  const [leftFilter, setLeftFilter] = React.useState({
    page: 0,
    keyword: ""
  });
  const [leftTotal, setLeftTotal] = React.useState(0)

  const [selectedPlayer, setSelectedPlayer] = React.useState({ playerid: 'player1', device: { _id: "" } })
  const [selectedDevice, setSelectedDevice] = React.useState({ _id: "" })
  const [leftItems, setLeftItems] = React.useState([])

  React.useEffect(() => {
    getDeviceList()
  }, [])

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

  return (
    <div className={classes.content}>
      <div className={classes.contentInnerLeft}>
        {
          playerlist.map(player =>
            <Player
              isSelected={player.playerid === selectedPlayer.playerid}
              key={player.playerid}
              player={player}
              handleCheckPlayer={() => handleCheckPlayer(player)}
              onDelete={() => handleDeletePlayer(player.playerid)}
            />)
        }
      </div>
      <Paper className={classes.leftContent}>
        <SearchTextField style={{ flex: 'unset' }} placeholder={t("search-keyword")} />
        {/* {leftTabIndex === 0 && <MuiSelect
          onChange={e => handleChangeLeftFilter('groupid', e.target.value)}
          style={{ marginTop: 20 }}
          value={leftFilter.groupid || ""}
          label="群組 ">
          {
            leftSelectOptions.map(item => <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>)
          }
        </MuiSelect>} */}
        <div className={classes.leftContentInner}>
          {
            leftItems.map(item => (
              <div
                style={selectedDevice._id === item._id ? { border: '3px solid' + palette.primary.main } : { border: '3px solid white' }}
                className={classes.leftContentInnerItem}
                onClick={() => handleCheckDevice(item)}
                key={item._id}>
                <VideocamIcon style={{ margin: 10 }} />
                {item.name}
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
      </Paper>
    </div>
  )
}