import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { LocaleContext } from "../../contexts/LocaleContext";
import {
  Button,
  TextField,
  Paper,
  Select,
  MenuItem,
  Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton
} from '@material-ui/core'

import Text from "../Text"
import Tab from '../common/Tab';
import Tabs from "../common/Tabs"


import {
} from '@material-ui/core';


import {
  Delete,
} from '@material-ui/icons';

const viewBackgroundColor = "#e5e5e5"

const useStyles = makeStyles((theme) => ({
  content: {
    width: 700,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 12
  },
  contentInner: {
    backgroundColor: viewBackgroundColor,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  contentTopbar: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  paper: {
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 20,
    // padding: theme.spacing(2)
  },
  info: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    height: 45,
    marginBottom: 5,
    // margin: '6px 12px',
    '& > *': {
      flex: 1
    },
  }
}));

export default ({
  onSave,
  authedApi,
  area = {}
}) => {
  const { t } = useContext(LocaleContext);

  // const { authedApi } = useContext(AuthContext);
  const classes = useStyles();
  const [state, setState] = React.useState({
    name: '',
    entrys: [],
    exits: []
  })
  const [tabIndex, setTabIndex] = React.useState(0)

  React.useEffect(() => {
    getArea()
  }, [])

  const getArea = async () => {
    let areaid = area.areaid
    const { result } = await authedApi.getArea({ areaid, limit: 50, page: 1 })
    let entrys = [...result].filter(_id => _id.enter !== null)
    let exits = [...result].filter(_id => _id.leave !== null)

    setState({
      name: area.name,
      entrys,
      exits
    })
  }

  const handleChangeEnter = (e, row) => {
    let newEntrys = [...state.entrys]
    newEntrys = newEntrys.map(entry =>
      entry.id === row.id
        ? { ...entry, enter: e.target.value }
        : { ...entry }
    )
    setState({
      ...state,
      entrys: newEntrys
    })
  }

  const handleChangeLeave = (e, row) => {
    let newExits = [...state.exits]
    newExits = newExits.map(exit =>
      exit.id === row.id
        ? { ...exit, leave: e.target.value }
        : { ...exit }
    )
    setState({
      ...state,
      exits: newExits
    })
  }

  const Entry = () => {
    return (
      <TableBody>
        {state.entrys.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              {row.name}
            </TableCell>
            <TableCell>
              <Select
                onChange={(e) => handleChangeEnter(e, row)}
                value={row.enter}>
                <MenuItem value={1}>enter</MenuItem>
                <MenuItem value={0}>leave</MenuItem>
              </Select>
            </TableCell>
            <TableCell>
              <IconButton><Delete /></IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    )
  }

  const Exit = () => {
    return (
      <TableBody>
        {state.exits.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              {row.name}
            </TableCell>
            <TableCell>
              <Select
                onChange={handleChangeLeave}
                value={row.leave}>
                <MenuItem value={1}>enter</MenuItem>
                <MenuItem value={0}>leave</MenuItem>
              </Select>
            </TableCell>
            <TableCell>
              <IconButton><Delete /></IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>)
  }
  // console.log(area)
  return (
    <div className={classes.content}>
      <div>
        <Text required>{t('name')}</Text>
        <TextField
          value={state.name || ''}
          onChange={e => setState({
            ...state,
            name: e.target.value
          })}
        />
      </div>
      <div className={classes.contentInner}>
        <div className={classes.contentTopbar}>
          <Tabs
            style={{ width: 300 }}
            value={tabIndex}
            TabIndicatorProps={{ style: { background: 'white' } }}
            onChange={(event, newValue) => {
              setTabIndex(newValue);
            }}
            textColor="primary"
          >
            <Tab label={t('entry')} />
            <Tab label={t('exit')} />
          </Tabs>
          <div>
            <Button variant="contained" color="primary" onClick={() => { }}>新增</Button>
          </div>
        </div>
        <Paper className={classes.paper}>
          <TableContainer component="div">
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>名稱</TableCell>
                  <TableCell></TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              {{
                0: <Entry />,
                1: <Exit />
              }[tabIndex]}
            </Table>
          </TableContainer>
        </Paper>
      </div>
      <div style={{ width: '100%', paddingTop: 10 }}>
        <Button
          style={{ float: 'right' }}
          variant="contained"
          onClick={() => onSave(state)} color="primary">Save</Button>
      </div>
    </div>
  )
}