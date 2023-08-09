import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { LocaleContext } from "../contexts/LocaleContext";
import { LayoutContext } from "../contexts/LayoutContext";
import { makeStyles } from '@material-ui/core/styles';
import { Paper, TextField, MenuItem, Button, CircularProgress } from '@material-ui/core';
import Text from "../components/Text"
import Select from "../components/Select"

// import {
//   PlayArrow,
//   BorderColorSharp,
//   FiberManualRecord,
//   AddBox,
//   Delete,
//   LocationOn
// } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  content: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  info: {
    display: 'flex',
    width: 'calc(50% - 16px)',
    alignItems: 'center',
    height: 45,
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    '& > *': {
      flex: 1
    },
  }
}));

const languages = [
  { name: "繁體中文", value: "ZH-TW" },
  { name: "日本語", value: "JA-JP" },
  { name: "英文", value: "EN-US" }
]

export default () => {
  const classes = useStyles();
  const { authedApi } = useContext(AuthContext);
  const { t } = useContext(LocaleContext);
  const { setSnackBar, showModal, hideModal, showWarningConfirm } = useContext(LayoutContext);
  const [isloading, setLoading] = React.useState(false)
  const [setting, setSetting] = React.useState({})
  React.useEffect(() => {
    (async () => {
      const [result] = await authedApi.getGeneralSetting({})
      setSetting({ ...result })
      // console.log(result)
    })();
  }, [])

  const handleEditSetting = async () => {
    await authedApi.editGeneralSetting({ data: { ...setting } })
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  const handleSendEmail = async () => {
    setLoading(true)
    await authedApi.sendEmail().finally(() => {
      setLoading(false)
    });
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  return (
    <div className={classes.root}>
      <div style={{ textAlign: 'right' }}>
        <Button style={{ marginBottom: 20 }} color="primary" variant="contained" onClick={handleEditSetting}>儲存</Button></div>
      <Paper className={classes.paper}>
        <h6 style={{ marginLeft: 16 }}>一般</h6>
        <div className={classes.content}>
          <div className={classes.info}>
            <Text required>{t('language')}</Text>

            <Select
              // style={{ marginLeft: 20 }}
              value={setting.language || ""}
              onChange={(e) => setSetting({
                ...setting,
                language: e.target.value
              })}
            // label={t("language")}
            >
              {
                languages
                  .map(language =>
                    <MenuItem
                      key={language.name}
                      value={language.value}>
                      {language.name}
                    </MenuItem>)
              }
            </Select>
          </div>
          <div className={classes.info}>
            <Text required>{'Keep Days'}</Text>
            <TextField
              value={setting.keepdays || ''}
              onChange={e => setSetting({
                ...setting,
                keepdays: e.target.value
              })}
            />
          </div>
          <div className={classes.info}>
            <Text required>{'HTTPS Port'}</Text>
            <TextField
              value={setting.sslport || ''}
              onChange={e => setSetting({
                ...setting,
                sslport: e.target.value
              })}
            />
          </div>
          <div className={classes.info}>
            <Text required>{'HTTP Port'}</Text>
            <TextField
              value={setting.httpport || ''}
              onChange={e => setSetting({
                ...setting,
                httpport: e.target.value
              })}
            />
          </div>
          <div className={classes.info}>
            <Text>{'Download Path'}</Text>
            <TextField
              value={setting.downloadpath || ''}
              onChange={e => setSetting({
                ...setting,
                downloadpath: e.target.value
              })}
            />
          </div>
        </div>

        <div style={{ marginLeft: 16, marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h6>SMTP</h6>
          {
            isloading
              ? <CircularProgress />
              : <Button color="primary" variant="outlined" onClick={handleSendEmail}>Send Email</Button>
          }
        </div>
        <div className={classes.content}>
          <div className={classes.info}>
            <Text>{'sender'}</Text>
            <TextField
              value={setting.sender || ''}
              onChange={e => setSetting({
                ...setting,
                sender: e.target.value
              })}
            />
          </div>
          <div className={classes.info}>
            <Text>{'senderemail'}</Text>
            <TextField
              value={setting.senderemail || ''}
              onChange={e => setSetting({
                ...setting,
                senderemail: e.target.value
              })}
            />
          </div>
          <div className={classes.info}>
            <Text>{'mailserver'}</Text>
            <TextField
              value={setting.mailserver || ''}
              onChange={e => setSetting({
                ...setting,
                mailserver: e.target.value
              })}
            />
          </div>
          <div className={classes.info}>
            <Text>{'mailserveraccount'}</Text>
            <TextField
              value={setting.mailserveraccount || ''}
              onChange={e => setSetting({
                ...setting,
                mailserveraccount: e.target.value
              })}
            />
          </div>
          <div className={classes.info}>
            <Text>{'mailserverpassword'}</Text>
            <TextField
              value={setting.mailserverpassword || ''}
              onChange={e => setSetting({
                ...setting,
                mailserverpassword: e.target.value
              })}
            />
          </div>
          <div className={classes.info}>
            <Text>{'mailserverport'}</Text>
            <TextField
              value={setting.mailserverport || ''}
              onChange={e => setSetting({
                ...setting,
                mailserverport: e.target.value
              })}
            />
          </div>
        </div>
      </Paper>
    </div>
  )
}