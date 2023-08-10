import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { LocaleContext } from "../contexts/LocaleContext";
import { LayoutContext } from "../contexts/LayoutContext";
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper, TextField, MenuItem, Button, CircularProgress,
  IconButton
} from '@material-ui/core';
import Text from "../components/Text"
import Select from "../components/Select"
import Tab from '../components/common/Tab';
import Tabs from "../components/common/Tabs"
import SimpleTable from "../components/table/SimpleTable"
import moment from 'moment'
import {
  // PlayArrow,
  // BorderColorSharp,
  // FiberManualRecord,
  // AddBox,
  Delete,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 700,
    margin: 'auto',
    position: 'relative'
  },
  paper: {
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(3),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  content: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  info: {
    display: 'flex',
    width: 'calc(50% - 24px)',
    alignItems: 'center',
    height: 45,
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(3),
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
  const fileRef = React.useRef()
  const { authedApi } = useContext(AuthContext);
  const { t } = useContext(LocaleContext);
  const [tabIndex, setTabIndex] = React.useState(0)
  const { setSnackBar, showModal, hideModal, showWarningConfirm } = useContext(LayoutContext);
  const [isloading, setLoading] = React.useState(false)
  const [setting, setSetting] = React.useState({})
  const [license, setLicense] = React.useState({})
  const [file, setFile] = React.useState()
  React.useEffect(() => {
    (async () => {
      const [result] = await authedApi.getGeneralSetting({})
      setSetting({ ...result })
    })();
  }, [])

  React.useEffect(() => {
    getLicenseList()
  }, [])

  const getLicenseList = async () => {
    const _license = await authedApi.getLicenseList({
      order: 'desc',
      orderBy: 'datetime',
      page: 1,
      limit: 5
    })
    let result = _license.result
      .map(lic => ({
        ...lic,
        id: lic.licenseid,
        createtime: moment(lic.createtime).format('YYYY-MM-DD hh:mm:ss'),
        expirationutc: moment(lic.expirationutc).format('YYYY-MM-DD hh:mm:ss'),
      }))
    setLicense({ ..._license, result })
  }

  const handleEditSetting = async () => {
    await authedApi.editGeneralSetting({ data: { ...setting } })
    setSnackBar({
      message: t("saveSuccess"),
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
      message: t("saveSuccess"),
      isOpen: true,
      severity: "success"
    })
  }

  const Normal = () => (<React.Fragment>
    <h6 style={{ marginLeft: 16 }}>{t('normal')}</h6>
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
        <Text required>{t('keepdays')}</Text>
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
        <Text>{t('downloadpath')}</Text>
        <TextField
          value={setting.downloadpath || ''}
          onChange={e => setSetting({
            ...setting,
            downloadpath: e.target.value
          })}
        />
      </div>
    </div>
    <div style={{
      height: 40,
      marginLeft: 16,
      marginTop: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <h6>SMTP</h6>
      {
        isloading
          ? <CircularProgress />
          : <Button color="primary" variant="outlined" onClick={handleSendEmail}>{t('sendtestemail')}</Button>
      }
    </div>
    <div className={classes.content}>
      <div className={classes.info}>
        <Text>{t('sender')}</Text>
        <TextField
          value={setting.sender || ''}
          onChange={e => setSetting({
            ...setting,
            sender: e.target.value
          })}
        />
      </div>
      <div className={classes.info}>
        <Text>{t('senderemail')}</Text>
        <TextField
          value={setting.senderemail || ''}
          onChange={e => setSetting({
            ...setting,
            senderemail: e.target.value
          })}
        />
      </div>
      <div className={classes.info}>
        <Text>{t('mailserver')}</Text>
        <TextField
          value={setting.mailserver || ''}
          onChange={e => setSetting({
            ...setting,
            mailserver: e.target.value
          })}
        />
      </div>
      <div className={classes.info}>
        <Text>{t('account')}</Text>
        <TextField
          value={setting.mailserveraccount || ''}
          onChange={e => setSetting({
            ...setting,
            mailserveraccount: e.target.value
          })}
        />
      </div>
      <div className={classes.info}>
        <Text>{t('password')}</Text>
        <TextField
          value={setting.mailserverpassword || ''}
          onChange={e => setSetting({
            ...setting,
            mailserverpassword: e.target.value
          })}
        />
      </div>
      <div className={classes.info}>
        <Text>{"Port"}</Text>
        <TextField
          value={setting.mailserverport || ''}
          onChange={e => setSetting({
            ...setting,
            mailserverport: e.target.value
          })}
        />
      </div>
    </div>
  </React.Fragment>)
  const License = () => (<React.Fragment>
    <div className={classes.content}>
      <div className={classes.info}>
        <Text>授權資訊</Text>
        <Button color="primary" variant="outlined" >取得</Button>
      </div>
      <div className={classes.info}>
        <Text>授權清單</Text>
        <div><input
          ref={fileRef}
          accept="image/png,image/jpeg"
          style={{ display: 'none' }}
          id="contained-button-file"
          // multiple
          onChange={e => {
            setFile(e.target.files[0])
            e.target.value = null
          }}
          type="file"
        />
          {
            file
              ? <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: 1 }}>{file.name}</span>
                <IconButton onClick={() => {
                  setFile(null)
                  fileRef.current.value = null
                }}>
                  <Delete />
                </IconButton>
                <Button color="primary" variant="outlined" component="span">
                  {t("save")}
                </Button>
              </div>
              : <label htmlFor="contained-button-file">
                <Button color="primary" variant="outlined" component="span">
                  {t("upload")}
                </Button>
              </label>
          }
        </div>
      </div>
      <div className={classes.info}>
        <Text>授權數量</Text>
        <Text>{license.total_amount}</Text>
      </div>
      <div className={classes.info}>
        <Text>已使用授權</Text>
        <Text>{license.used_amount}</Text>
      </div>
    </div>
    <SimpleTable
      style={{ paddingLeft: 20 }}
      columns={
        [
          { key: 'amount', label: t("amount") },
          { key: 'createtime', label: t("createtime") },
          { key: 'expirationutc', label: t("expirationutc") },
        ]}
      data={license.result}
      component="div"
      actions={[]}
    />
  </React.Fragment>)
  return (
    <div className={classes.root}>
      {tabIndex === 0 && <Button style={{ position: 'absolute', right: 0 }} color="primary" variant="contained" onClick={handleEditSetting}>{t('save')}</Button>}      <Tabs
        value={tabIndex}
        TabIndicatorProps={{ style: { background: 'white' } }}
        onChange={(event, newValue) => {
          setTabIndex(newValue);
        }}
        textColor="primary"
      >
        <Tab label={t('normal')} />
        <Tab label="license" />
      </Tabs>
      <Paper className={classes.paper}>
        {
          {
            0: <Normal />,
            1: <License />
          }[tabIndex]
        }
      </Paper>
    </div>
  )
}