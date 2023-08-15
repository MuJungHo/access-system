import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import { LocaleContext } from "../../contexts/LocaleContext";
import { Checkbox, FormControlLabel, TablePagination } from '@material-ui/core';
import SearchTextField from "../common/SearchTextField"

import {
  // Paper,
  // Divider,
  Button,
} from '@material-ui/core'

import Text from "../Text"

const viewBackgroundColor = "#e5e5e5"

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  },
  content: {
    width: 500,
    height: 565,
    backgroundColor: '#fff',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: 12
  },
  contentInner: {
    flex: 1,
    marginTop: 10,
    backgroundColor: viewBackgroundColor,
    display: 'flex',
    flexWrap: 'wrap',
    // justifyContent: 'space-around',
    alignItems: 'flex-start',
    alignContent: 'flex-start'
  },
  contentInnerItem: {
    width: 'calc(50% - 12px)',
    height: 50,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 8,
    // marginRight: 8,
    marginTop: 8,
    borderRadius: 5
  },
}));

const permissions = [
  { name: "device" },
  { name: "event" },
  { name: "log" },
  { name: "home" },
  { name: "account" },
  { name: "staff" },
  { name: "access" },
  { name: "setting" },
  { name: "building" },
  { name: "bell" },
  { name: "info" },
  { name: "video" },
]

export default ({ onSave, permission, user }) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const [state, setState] = React.useState([])


  React.useEffect(() => {
    let _permission = JSON.parse(permission)
    _permission = _permission.filter(p => p.enable).map(p => p.name)
    // console.log(_permission)
    setState(_permission)
  }, [permission])

  const handleChange = (event) => {
    let newState = [...state]
    if (event.target.checked) {
      newState.push(event.target.name)
    } else {
      newState = newState.filter(state => state !== event.target.name)
    }
    setState(newState)
  };

  return (
    <div className={classes.content}>
      <div className={classes.contentInner}>
        {
          permissions.map((item) => <div key={item.name} className={classes.contentInnerItem}>
            <FormControlLabel
              style={{ width: '100%', margin: 0, height: '100%' }}
              control={
                <Checkbox
                  checked={state.includes(item.name)}
                  onChange={handleChange}
                  name={item.name}
                  color="primary"
                />
              }
              label={item.name}
            />
          </div>)
        }
      </div>
      <div style={{ width: '100%', paddingTop: 10, paddingBottom: 20 }}>
        <Button
          style={{ float: 'right' }}
          variant="contained"
          onClick={() => onSave(state, user.accountid)} color="primary">{t("save")}</Button>
      </div>
    </div>
  )
}