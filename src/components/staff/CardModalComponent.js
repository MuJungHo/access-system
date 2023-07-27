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

export default ({ card, onSave }) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const [state, setState] = React.useState({})

  React.useEffect(() => {
    setState({ ...card })
  }, [card])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', paddingLeft: 20, paddingRight: 20 }}>
      <div className={classes.info}>
        <span>{t('cardnumber')}</span>
        <TextField
          value={state.card_number || ''}
          onChange={e => setState({
            ...state,
            card_number: e.target.value
          })}
        />
      </div>
      <div className={classes.info}>
        <span>{t('starttime')}</span>
        <TextField
          type="datetime-local"
          value={state.starttimeFormat || ''}
          onChange={e => setState({
            ...state,
            starttimeFormat: e.target.value
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
          value={state.endtimeFormat || ''}
          // className={classes.textField}
          onChange={e => setState({
            ...state,
            endtimeFormat: e.target.value
          })}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <div style={{ width: '100%', paddingTop: 10, paddingBottom: 20 }}>
        <Button
          style={{ float: 'right' }}
          variant="contained"
          onClick={() => onSave(state)} color="primary">Save</Button>
      </div>
    </div>
  )
}