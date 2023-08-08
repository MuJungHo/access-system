import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import { LocaleContext } from "../../contexts/LocaleContext";
import { usertypes } from "../../utils/constants"

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

export default ({ user, onSave, locations }) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const [state, setState] = React.useState({})

  React.useEffect(() => {
    setState({ ...user })
  }, [user])
  // console.log(card)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', paddingLeft: 20, paddingRight: 20, paddingTop: 5 }}>
      <div className={classes.info}>
        <Text required>{t('name')}</Text>
        <TextField
          value={state.name || ''}
          onChange={e => setState({
            ...state,
            name: e.target.value,
          })}
        />
      </div>
      <div className={classes.info}>
        <Text required>{t('email')}</Text>
        <TextField
          value={state.email || ''}
          onChange={e => setState({
            ...state,
            email: e.target.value,
          })}
        />
      </div>
      <div className={classes.info}>
        <Text required>{t('password')}</Text>
        <TextField
          type="password"
          value={state.password || ''}
          onChange={e => setState({
            ...state,
            password: e.target.value,
          })}
        />
      </div>
      <div className={classes.info}>
        <Text required>{t('password')}</Text>
        <TextField
          type="password"
          value={state._password || ''}
          onChange={e => setState({
            ...state,
            _password: e.target.value,
          })}
        />
      </div>
      <div className={classes.info}>
        <Text>{t('location')}</Text>
        <Select
          style={{ margin: 20 }}
          value={state._locations || []}
          multiple
          onChange={e => setState({
            ...state,
            _locations: e.target.value
          })}
        // label={t("cardtype")}
        >
          {
            locations
              .map(location =>
                <MenuItem
                  key={location.locationid}
                  value={location.locationid}>
                  {location.name}
                </MenuItem>)
          }
        </Select>
      </div>
      <div className={classes.info}>
        <Text required>{"權限"}</Text>
        <Select
          style={{ margin: 20 }}
          value={state.roleid || ''}
          onChange={e => setState({
            ...state,
            roleid: e.target.value
          })}
          label={"權限"}
        >
          {
            usertypes
              .map(type =>
                <MenuItem
                  key={type.roleid}
                  value={type.roleid}>
                  {type.name}
                </MenuItem>)
          }
        </Select>
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