import React, { useContext, useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import { LocaleContext } from "../../contexts/LocaleContext";
import {
  // Paper,
  // Divider,
  Button,
  TextField,
  MenuItem,
  // IconButton,
  // Avatar
} from '@material-ui/core'

// import {
//   Delete,
// } from '@material-ui/icons';
import Text from "../Text"
import ImageUploader from './ImageUploader'

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
  // const fileRef = useRef()
  // console.log(state)
  React.useEffect(() => {
    setState({ ...face })
  }, [face])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', padding: 20 }}>
      <div className={classes.info}>
        <Text required>{"FRS"}</Text>
        <Select
          style={{ margin: 20 }}
          value={state.frs || ''}
          onChange={e => setState({
            ...state,
            frs: e.target.value
          })}
          label={"FRS"}
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
        <Text required>{t('starttime')}</Text>
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
        <Text required>{t('endtime')}</Text>
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
      <div style={{ display: 'flex', width: '100%', marginTop: 10 }}>
        <Text
          style={{ flex: 1 }} required>{"識別頭像"}</Text>
        <ImageUploader
          style={{ flex: 1 }}
          image={state.photo}
          onChange={image => setState({
            ...state,
            photo: image
          })}
          onClean={() => setState({
            ...state,
            photo: ""
          })}
        />
      </div>
      <div style={{ width: '100%' }}>
        <Button
          style={{ float: 'right' }}
          variant="contained"
          onClick={() => onSave(state)} color="primary">{t("save")}</Button>
      </div>
    </div>
  )
}