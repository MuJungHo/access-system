import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Information from "../../components/staff/Information"
import Vehicle from "../../components/staff/Vehicle"
import Card from "../../components/staff/Card"
import Face from "../../components/staff/Face"
import {
  Paper,
  Button,
  IconButton,

  Avatar,
} from '@material-ui/core'
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import moment from 'moment'

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
  const { setSnackBar, showModal } = useContext(LayoutContext);
  const [staff, setStaff] = useState({})
  const [cards, setCards] = useState([])
  const [faces, setFaces] = useState([])
  const [vehicles, setVehicles] = useState([])

  React.useEffect(() => {
    (async () => {
      const result = await authedApi.getStaff({ staffid })
      setStaff({
        ...result,
        groups: result.groups.map(g => g.staffgroupid),
        cardid: undefined,
        faceid: undefined,
        vehicleid: undefined
      })
      let cards_ = result.cardid?.map(c => {
        return {
          ...c,
          id: c.cardidid,
          card_type: (c.mifare && 'mifare') || (c.em && 'em') || (c.uhf && 'uhf'),
          card_number: c.mifarenumber || c.emnumber || c.uhfnumber,
          starttime: moment(c.starttime).format('YYYY-MM-DD hh:mm:ss'),
          endtime: moment(c.endtime).format('YYYY-MM-DD hh:mm:ss'),
        }
      }) || []
      setCards(cards_)

      let vehicles_ = result.vehicleid?.map(c => {
        return {
          ...c,
          id: c.vehicleidid,
          starttime: moment(c.starttime).format('YYYY-MM-DD hh:mm:ss'),
          endtime: moment(c.endtime).format('YYYY-MM-DD hh:mm:ss'),
        }
      }) || []
      setVehicles(vehicles_)


      let faces_ = result.faceid?.map(c => {
        return {
          ...c,
          id: c.faceidid,
          starttime: moment(c.starttime).format('YYYY-MM-DD hh:mm:ss'),
          endtime: moment(c.endtime).format('YYYY-MM-DD hh:mm:ss'),
          photo: <AvatarGroup max={4}>
            <Avatar src={`data:image/png;base64,${c.photo[0].photo}`} />
            <Avatar src={`data:image/png;base64,`} />
            <Avatar src={`data:image/png;base64,`} />
            <Avatar src={`data:image/png;base64,`} />
            <Avatar src={`data:image/png;base64,`} />
            <Avatar src={`data:image/png;base64,`} /></AvatarGroup>
          // photo: c.photo.length > 0 && <AvatarGroup >{
          //   c.photo.map(p => <Avatar key={p.faceidphotoid} src={`data:image/png;base64,${p.photo}`} />)
          // }</AvatarGroup>,
        }
      }) || []
      setFaces(faces_)
    })();
  }, [])

  return (
    <div className={classes.root}>
      <IconButton
        onClick={() => history.push('/staff/list')}>
        <ArrowBackIcon />
      </IconButton>
      <Information staff={staff} setStaff={setStaff} />
      <Face faces={faces} setFaces={setFaces} />
      <Vehicle vehicles={vehicles} setVehicles={setVehicles} />
      <Card cards={cards} setCards={setCards} />
    </div>)
}


export default Person;