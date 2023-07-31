import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import Text from "../../components/Text"
import { LocaleContext } from "../../contexts/LocaleContext";

import {
  // Paper,
  // Divider,
  Button,
  TextField,
  MenuItem,
} from '@material-ui/core'
import { identities } from "../../utils/constants"

const useStyles = makeStyles(() => ({
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

export default ({ staff, onSave }) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const [state, setState] = React.useState({})

  React.useEffect(() => {
    setState({ ...staff })
  }, [staff])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', paddingLeft: 20, paddingRight: 20 }}>
      <div className={classes.info}>
        <Text required>{t('name')}</Text>
        <TextField
          value={state.name || ''}
          onChange={e => setState({
            ...state,
            name: e.target.value
          })}
        />
      </div>

      <div className={classes.info}>
        <Text required>{t('identity')}</Text>
        <Select
          // style={{ width: '100%' }}
          value={state.identity || ''}
          onChange={e => setState({
            ...state,
            identity: e.target.value
          })}
          label={t("identity")}
        >
          {
            identities
              .map(i =>
                <MenuItem
                  key={i.value}
                  value={i.index}>
                  {t(i.value)}
                </MenuItem>)
          }
        </Select>
      </div>
      <div className={classes.info}>
        <span>{t('staffnumber')}</span>
        <TextField
          value={state.staffnumber || ''}
          onChange={e => setState({
            ...state,
            staffnumber: e.target.value
          })}
        />
      </div>
      <div className={classes.info}>
        <span>{t('idcardnumber')}</span>
        <TextField
          value={state.idcardnumber || ''}
          onChange={e => setState({
            ...state,
            idcardnumber: e.target.value
          })}
        />
      </div>
      <div className={classes.info}>
        <span>{t('phonenumber')}</span>
        <TextField
          value={state.phonenumber || ''}
          onChange={e => setState({
            ...state,
            phonenumber: e.target.value
          })}
        />
      </div>
      <div className={classes.info}>
        <span>{t('company')}</span>
        <TextField
          value={state.company || ''}
          onChange={e => setState({
            ...state,
            company: e.target.value
          })}
        />
      </div>
      <div className={classes.info}>
        <span>{t('department')}</span>
        <TextField
          value={state.department || ''}
          onChange={e => setState({
            ...state,
            department: e.target.value
          })}
        />
      </div>
      <div className={classes.info}>
        <span>{t('email')}</span>
        <TextField
          value={state.email || ''}
          onChange={e => setState({
            ...state,
            email: e.target.value
          })}
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