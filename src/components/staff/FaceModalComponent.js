import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import { LocaleContext } from "../../contexts/LocaleContext";

import {
  // Paper,
  // Divider,
  Button,
  TextField,
  MenuItem,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  },
  info: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    height: 45,
    // margin: '6px 12px',
    '& > *': {
      flex: 1
    },
  }
}));

export default ({ face, FRSDevices = [], onSave }) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const [state, setState] = React.useState({})

  React.useEffect(() => {
    setState({ ...face })
  }, [face])
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', padding: 20 }}>
      <div className={classes.info}>
        <span>{"FRS"}</span>
        <Select
        // style={{ margin: 20 }}
        // value={staff.identity || ''}
        // onChange={e => setStaff({
        //   ...staff,
        //   identity: e.target.value
        // })}
        >
          {
            FRSDevices
              .map(i =>
                <MenuItem
                  key={i.value}
                  value={i.value}>
                  {i.label}
                </MenuItem>)
          }
        </Select>
      </div>
      <div className={classes.info}>
        <span>{t('cardnumber')}</span>
        <TextField
          value={state.cardnumber || ''}
          onChange={e => setState({
            ...state,
            cardnumber: e.target.value
          })}
        />
      </div>
      <div className={classes.info}>
        <span>{t('starttime')}</span>
        <TextField
          type="datetime-local"
          value={state.starttime || ''}
          onChange={e => setState({
            ...state,
            starttime: e.target.value
          })}
          // className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <div className={classes.info}>
        <span>{t('endtime')}</span>
        <TextField
          type="datetime-local"
          value={state.endtime || ''}
          // className={classes.textField}
          onChange={e => setState({
            ...state,
            endtime: e.target.value
          })}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <div className={classes.info}>
        <span>{"識別頭像"}</span>
        {state.avatar}
      </div>
      <div style={{ width: '100%' }}>
        <Button
          style={{ float: 'right' }}
          variant="contained"
          onClick={() => onSave(state)} color="primary">Save</Button>
      </div>
    </div>
  )
}