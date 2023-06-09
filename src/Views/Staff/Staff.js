import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext";
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {
  Paper,
  Button,
  IconButton
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));
const Person = () => {
  const classes = useStyles();
  const history = useHistory();
  const { staffid } = useParams();
  const { authedApi } = useContext(AuthContext);
  const [staff, setStaff] = useState({})

  React.useEffect(() => {
    (async () => {
      const staff_ = await authedApi.getStaff({ staffid })
      setStaff(staff_)
    })();
  }, [])

  return (
    <div className={classes.root}>
      <IconButton onClick={() => history.push('/people')}><ArrowBackIcon /></IconButton>
      <Paper className={classes.paper}>
        {staff.name}
      </Paper>
    </div>)
}


export default Person;