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
  IconButton
} from '@material-ui/core'
import {
  Close,
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
      // flex: 1
    },
  }
}));

export default ({ staff, onSave }) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const [state, setState] = React.useState()
  const fileRef = useRef()

  // console.log(state)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
      <input
        ref={fileRef}
        accept="xlsx"
        style={{ display: 'none' }}
        id="contained-button-file"
        // multiple
        onChange={e => {
          setState(e.target.files[0])
          e.target.value = null
        }}
        type="file"
      />

      <div className={classes.info}>
        <span style={{ flex: 1 }}>{"選擇要上傳的檔案"}</span>
        {
          state
            ? <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ flex: 1 }}>{state.name}</span>
              <IconButton onClick={() => {
                setState(null)
                fileRef.current.value = null
              }}><Close /></IconButton>
            </div>
            : <label htmlFor="contained-button-file">
              <Button variant="contained" color="primary" variant="outlined" component="span">
                {"上傳"}
              </Button>
            </label>
        }
      </div>
      <div style={{ width: '100%', paddingTop: 10, paddingBottom: 20 }}>
        {/* {console.log(fileRef.current?.value)} */}
        <Button
          // disabled={fileRef.current === null || fileRef.current === undefined || fileRef.current?.value === ""}
          color="primary"
          style={{ float: 'right' }}
          variant="contained"
          onClick={() => onSave(fileRef.current.files[0])}>
          {"匯入"}
        </Button>
      </div>
    </div>
  )
}