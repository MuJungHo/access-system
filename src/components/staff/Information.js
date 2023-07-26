import React, { useContext } from "react";
// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { AuthContext } from "../../contexts/AuthContext";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import DetailCard from "../DetailCard";
import {
  // Paper,
  // Divider,
  // Button,
  MenuItem,
  TextField
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  },
  info: {
    display: 'flex',
    width: 'calc(50% - 24px)',
    alignItems: 'center',
    height: 45,
    margin: '6px 12px',
    '& > *': {
      flex: 1
    },
  }
}));

const identities = [{
  label: "Staff", value: 1,
}]

export default ({
  staff,
  setStaff
}) => {
  const classes = useStyles();
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);
  const { setSnackBar, showModal } = useContext(LayoutContext);
  // const classes = useStyles();
  const [groups, setGroups] = React.useState([])

  // console.log(staff)
  React.useEffect(() => {
    (async () => {
      const { result } = await authedApi.getStaffGroupList({ page: 1, limit: 10000 })
      setGroups(result)
    })()
  }, [])

  return (
    <DetailCard
      title="人員資訊"
      // onClick={handleSaveCamera} 
      style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', padding: 8 }}>
        <div className={classes.info}>
          <span>{t("name")}</span>
          <TextField value={staff.name || ''} />
        </div>
        <div className={classes.info}>
          <span>{t("photo")}</span>
          <div>{staff.photo ? <img src={`data:image/png;base64,${staff.photo}`} style={{ height: 50, width: 50 }} onClick={() => {
            showModal({
              title: "相片",
              component: <img src={`data:image/png;base64,${staff.photo}`} style={{ display: 'block', margin: 'auto', height: 150, width: 150 }} />,
              onConfirm: () => { },
              size: "xs"
            })
          }} /> : '--'}
          </div>
        </div>
        <div className={classes.info}>
          <span>{t("identity")}</span>
          <Select
            style={{ margin: 20 }}
            value={staff.identity || ''}
          // onChange={(e) => setCamerabinds(e.target.value)}
          // label={t("identity")}
          >
            {
              identities
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
          <span>{t("idcardnumber")}</span>
          <TextField value={staff.idcardnumber || ''} />
        </div>
        <div className={classes.info}>
          <span>{t("phonenumber")}</span>
          <TextField value={staff.phonenumber || ''} />
        </div>
        <div className={classes.info}>
          <span>{t("company")}</span>
          <TextField value={staff.company || ''} />
        </div>
        <div className={classes.info}>
          <span>{t("department")}</span>
          <TextField value={staff.department || ''} />
        </div>
        <div className={classes.info}>
          <span>{t("email")}</span>
          <TextField value={staff.email || ''} />
        </div>
        <div className={classes.info}>
          <span>{t("note")}</span>
          <TextField value={staff.note || ''} />
        </div>
        <div className={classes.info}>
          <span>{t("group")}</span>
          <Select
            style={{ margin: 20 }}
            value={staff.groups || []}
            multiple
            // onChange={(e) => setCamerabinds(e.target.value)}
            label={t("group")}
          >
            {
              groups
                .map(i =>
                  <MenuItem
                    key={i.staffgroupid}
                    value={i.staffgroupid}>
                    {i.name}
                  </MenuItem>)
            }
          </Select>
        </div>
      </div>
    </DetailCard>
  )
}