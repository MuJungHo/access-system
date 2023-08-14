import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { LocaleContext } from "../../contexts/LocaleContext";
import {
  Button,
  TextField,
  MenuItem,
  Select
} from '@material-ui/core'

import Text from "../Text"


const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  },
  content: {
    width: 500,
    backgroundColor: '#fff',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: 12
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
  gate = {},
  type = "",
  excludeList = []
}) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const [state, setState] = React.useState({ ...gate })
  const [devices, setDevices] = React.useState([])
  // console.log(type)
  React.useEffect(() => {
    getDeviceList()
  }, [])

  const getDeviceList = async () => {
    let exclude_list = [...excludeList].filter(_id => _id !== gate.id)
    const { result } = await authedApi.postDeviceList({ limit: 10000, page: 1 })
    setDevices(result)
  }

  return (
    <div className={classes.content}>
      <div className={classes.info}>
        <Text required>{t('name')}</Text>
        <Select
          value={state.id}
          label={t('name')}
          onChange={e => setState({
            ...state,
            id: Number(e.target.value)
          })}
          displayEmpty
        >
          <MenuItem value="">請選擇</MenuItem>
          {
            devices.map(device => <MenuItem
              value={device.id}
              key={device.id}>
              {device.name}
            </MenuItem>)
          }
        </Select>
      </div>
      <div className={classes.info}>
        <Text required>{"卡機設定"}</Text>
        <Select
          value={state[type]}
          label={"卡機設定"}
          onChange={e => setState({
            ...state,
            [type]: e.target.value
          })}
        >
          <MenuItem value={0}>Exit</MenuItem>
          <MenuItem value={1}>Entry</MenuItem>
        </Select>
      </div>
      <div style={{ width: '100%', paddingTop: 10 }}>
        <Button
          style={{ float: 'right' }}
          variant="contained"
          onClick={() => onSave(state, type)} color="primary">Save</Button>
      </div>
    </div>
  )
}