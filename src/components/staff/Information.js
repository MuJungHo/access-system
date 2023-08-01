import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom"
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
import { identities } from "../../utils/constants"
import ImageUploader from './ImageUploader'
import Text from "../Text"

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

export default ({
  staff,
  setStaff
}) => {
  const classes = useStyles();
  const { staffid } = useParams();
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

  const handleSaveStaff = async () => {
    await authedApi.editStaff({ data: { ...staff }, staffid })
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  return (
    <DetailCard
      title="人員資訊"
      onClick={handleSaveStaff}
      style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', padding: 8 }}>
        <div style={{ display: 'flex', width: '100%', margin: '6px 12px' }}>
          <ImageUploader
            style={{
              flex: 1
            }}
            image={staff.photo}
            onChange={image => setStaff({
              ...staff,
              photo: image
            })}
            onClean={() => setStaff({
              ...staff,
              photo: ""
            })}
          />
          <div style={{ flex: 1 }}>
            <div className={classes.info} style={{ width: 'calc(100% - 12px)' }}>
              <Text required>{t('name')}</Text>
              <TextField
                value={staff.name || ''}
                onChange={e => setStaff({
                  ...staff,
                  name: e.target.value
                })}
              />
            </div>
            <div className={classes.info} style={{ width: 'calc(100% - 12px)' }}>
              <Text required>{t('identity')}</Text>
              <Select
                // style={{ width: '100%' }}
                value={staff.identity || ''}
                onChange={e => setStaff({
                  ...staff,
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
          </div>
        </div>
        <div className={classes.info}>
          <span>{t("group")}</span>
          <Select
            style={{ margin: 20 }}
            value={staff.groups || []}
            multiple
            onChange={e => setStaff({
              ...staff,
              groups: e.target.value
            })}
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
        <div className={classes.info}>
          <span>{t("staffnumber")}</span>
          <TextField value={staff.staffnumber || ''}
            onChange={e => setStaff({
              ...staff,
              staffnumber: e.target.value
            })} />
        </div>
        <div className={classes.info}>
          <span>{t("idcardnumber")}</span>
          <TextField value={staff.idcardnumber || ''}
            onChange={e => setStaff({
              ...staff,
              idcardnumber: e.target.value
            })} />
        </div>
        <div className={classes.info}>
          <span>{t("phonenumber")}</span>
          <TextField value={staff.phonenumber || ''}
            onChange={e => setStaff({
              ...staff,
              phonenumber: e.target.value
            })} />
        </div>
        <div className={classes.info}>
          <span>{t("company")}</span>
          <TextField value={staff.company || ''}
            onChange={e => setStaff({
              ...staff,
              company: e.target.value
            })} />
        </div>
        <div className={classes.info}>
          <span>{t("department")}</span>
          <TextField value={staff.department || ''}
            onChange={e => setStaff({
              ...staff,
              department: e.target.value
            })} />
        </div>
        <div className={classes.info}>
          <span>{t("email")}</span>
          <TextField value={staff.email || ''}
            onChange={e => setStaff({
              ...staff,
              email: e.target.value
            })} />
        </div>
        <div className={classes.info}>
          <span>{t("note")}</span>
          <TextField value={staff.note || ''}
            onChange={e => setStaff({
              ...staff,
              note: e.target.value
            })} />
        </div>
      </div>
    </DetailCard>
  )
}