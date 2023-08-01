import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import { LocaleContext } from "../../contexts/LocaleContext";
import { cardtypes } from "../../utils/constants"

import {
  // Paper,
  // Divider,
  Button,
  TextField,
  MenuItem,
} from '@material-ui/core'

import Text from "../Text"

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
  // console.log(card)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', paddingLeft: 20, paddingRight: 20, paddingTop: 5 }}>
      <div className={classes.info}>
        <Text required>{t("cardtype")}</Text>
        <Select
          style={{ margin: 20 }}
          value={state.card_type || ''}
          onChange={e => setState({
            ...state,
            card_type: e.target.value,
            em: e.target.value === "em" ? 1 : 0,
            mifare: e.target.value === "mifare" ? 1 : 0,
            uhf: e.target.value === "uhf" ? 1 : 0,
            emnumber: e.target.value === "em" ? state.card_number : "",
            mifarenumber: e.target.value === "mifare" ? state.card_number : "",
            uhfnumber: e.target.value === "uhf" ? state.card_number : "",
          })}
        // label={t("cardtype")}
        >
          {
            cardtypes
              .map(type =>
                <MenuItem
                  key={type.value}
                  value={type.value}>
                  {type.value}
                </MenuItem>)
          }
        </Select>
      </div>
      <div className={classes.info}>
        <Text required>{t('cardnumber')}</Text>
        <TextField
          value={state.card_number || ''}
          onChange={e => setState({
            ...state,
            card_number: e.target.value,
            emnumber: state.card_type === "em" ? e.target.value : "",
            mifarenumber: state.card_type === "mifare" ? e.target.value : "",
            uhfnumber: state.card_type === "uhf" ? e.target.value : "",
          })}
        />
      </div>
      <div className={classes.info}>
        <Text required>{t('starttime')}</Text>
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
        <Text required>{t('endtime')}</Text>
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