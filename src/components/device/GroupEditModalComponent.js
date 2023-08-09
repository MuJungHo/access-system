import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import { LocaleContext } from "../../contexts/LocaleContext";
import SearchTextField from "../common/SearchTextField"

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

export default ({ group, onSave, locations }) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const [state, setState] = React.useState({})

  React.useEffect(() => {
    setState({ ...group })
  }, [group])

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
        <Text>{t('location')}</Text>
        <Select
          style={{ margin: 20 }}
          value={state.locationid || ''}
          onChange={e => setState({
            ...state,
            locationid: e.target.value
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
      <div style={{ width: '100%', paddingTop: 10, paddingBottom: 20 }}>
        <Button
          style={{ float: 'right' }}
          variant="contained"
          onClick={() => onSave(state, group)} color="primary">Save</Button>
      </div>
    </div>
  )
}