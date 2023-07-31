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
  IconButton,
  Avatar
} from '@material-ui/core'

import {
  Delete,
} from '@material-ui/icons';

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
  const fileRef = useRef()
  // console.log(state)
  React.useEffect(() => {
    setState({ ...face })
  }, [face])

  const handleFileRead = async (event) => {
    const file = event.target.files[0]
    let base64 = await convertBase64(file)
    base64 = base64.split(",")[1]
    setState({
      ...state,
      photo: base64
    })
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', padding: 20 }}>
      <div className={classes.info}>
        <span>{"FRS"}</span>
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
        <input
          ref={fileRef}
          accept="image/png, image/jpeg"
          style={{ display: 'none' }}
          id="contained-button-file"
          // multiple
          onChange={handleFileRead}
          type="file"
        />
        {
          state.photo
            ? <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={`data:image/png;base64, ${state.photo}`} style={{ maxWidth: 50, maxHeight: 50 }} />
              <IconButton onClick={() => {
                fileRef.current.value = ""
                setState({
                  ...state,
                  photo: ""
                })
              }}><Delete /></IconButton>
            </div>
            : <label htmlFor="contained-button-file">
              <Button variant="contained" color="primary" variant="outlined" component="span">
                {"上傳"}
              </Button>
            </label>
        }
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