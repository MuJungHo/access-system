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
      // flex: 1
    },
  }
}));

export default ({ staff, onSave }) => {
  const { t, locale } = useContext(LocaleContext);
  const classes = useStyles();
  const [state, setState] = React.useState()
  const fileRef = useRef()

  const onDownload = () => {
    const link = document.createElement("a");
    link.download = `download.xlsx`;
    link.href = `${process.env.PUBLIC_URL}/assets/Staff_import_${{
      "zh-TW": "cht",
      "en": "eng",
      // "jpn": "jpn"
    }[locale]}.xlsx`
    link.click();
  }
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
        <span style={{ flex: 1 }}>{(t("sampleDownload"))}</span>
        <Button onClick={onDownload} variant="outlined" color="primary">
          {t("download")}
        </Button>
      </div>

      <div className={classes.info}>
        <span style={{ flex: 1 }}>{t("select-thing", { thing: t("file") })}</span>
        {
          state
            ? <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ flex: 1 }}>{state.name}</span>
              <IconButton onClick={() => {
                setState(null)
                fileRef.current.value = null
              }}><Delete /></IconButton>
            </div>
            : <label htmlFor="contained-button-file">
              <Button color="primary" variant="outlined" component="span">
                {t("upload")}
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
          {t("import")}
        </Button>
      </div>
    </div>
  )
}