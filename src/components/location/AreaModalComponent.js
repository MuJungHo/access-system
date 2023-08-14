import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { LocaleContext } from "../../contexts/LocaleContext";
import {
  Button,
  TextField,
  MenuItem,
  Select
} from '@material-ui/core'

import Text from "../Text"


const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  },
  content: {
    width: 500,
    backgroundColor: '#fff',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: 12
  },
  info: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    height: 45,
    marginBottom: 5,
    // margin: '6px 12px',
    '& > *': {
      flex: 1
    },
  }
}));

export default ({
  onSave,
}) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  const [name, setName] = React.useState("")
  // console.log(type)

  return (
    <div className={classes.content}>
      <div className={classes.info}>
        <Text required>{t('name')}</Text>
        <TextField variant="outlined" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div style={{ width: '100%', paddingTop: 10 }}>
        <Button
          style={{ float: 'right' }}
          variant="contained"
          onClick={() => onSave(name)} color="primary">Save</Button>
      </div>
    </div>
  )
}