import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom"
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { AuthContext } from "../../contexts/AuthContext";
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment'
import DetailCard from "../DetailCard";
import SimpleTable from "../table/SimpleTable"
import FaceModalComponent from "./FaceModalComponent"
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import {
  // Paper,
  // Divider,
  // Button,
  // MenuItem,
  Avatar,
} from '@material-ui/core'

import {
  Delete,
  ExitToApp
} from '@material-ui/icons';

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     width: '100%',
//   }
// }));

export default ({
  faces = [],
  setFaces
}) => {
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);
  const { setSnackBar, showModal, hideModal, showWarningConfirm } = useContext(LayoutContext);
  const [FRSDevices, setFRSDevices] = React.useState([])
  const { staffid } = useParams();

  // const classes = useStyles();

  React.useEffect(() => {
    (async () => {
      const { result } = await authedApi.getDeviceList({
        category: "FRS"
        , limit: 10000
        , page: 1
      })
      let options = result.map(c => ({ value: c.id, label: c.name, ...c }))
      setFRSDevices(options)
    })()
  }, [])

  const showAddFaceModal = () => {
    showModal({
      title: "新增頭像資訊",
      component: <FaceModalComponent
        face={{}}
        FRSDevices={FRSDevices}
        onSave={handleAddFace} />
    })
  }

  const handleAddFace = async (state) => {
    const { faceidid, faceidphotoid } = await authedApi.addStaff({
      data: {
        staffid: Number(staffid),
        brandid: 9,
        cardnumber: state.cardnumber,
        photo: state.photo,
        starttime: moment(state.starttime).valueOf(),
        endtime: moment(state.endtime).valueOf(),
      }, type: 1
    })

    const newFaces = [...faces, {
      faceidid,
      faceidphotoid,
      id: faceidid,
      enable: 1,
      photo: state.photo,
      avatar: <Avatar src={`data:image/png;base64,${state.photo}`} />,
      cardnumber: state.cardnumber,
      endtime: moment(state.endtime).valueOf(),
      starttime: moment(state.starttime).valueOf(),
      starttimeFormat: moment(state.starttime).format('YYYY-MM-DD hh:mm:ss'),
      endtimeFormat: moment(state.endtime).format('YYYY-MM-DD hh:mm:ss'),
    }]
    setFaces(newFaces)
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  const showDeleteFaceConfirm = (row) => {
    showWarningConfirm({
      title: '刪除頭像資訊',
      component: <h6 style={{ margin: 16 }}>{`確認刪除卡號 ${row.cardnumber} 頭像資訊？`}</h6>,
      onConfirm: () => handleDeleteFace(row.faceidid)
    })
  }

  const handleDeleteFace = async (faceidid) => {
    await authedApi.deleteStaffFace({ faceidid })
    const newFaces = faces.filter(card => card.faceidid !== faceidid)
    setFaces(newFaces)
    setSnackBar({
      message: "刪除成功",
      isOpen: true,
      severity: "success"
    })
    // console.log(faceidid)
  }

  const handleEditFace = (row) => {
    // console.log(row)
    showModal({
      title: "編輯頭像資訊",
      component: <FaceModalComponent
        face={row}
        FRSDevices={FRSDevices}
        onSave={handleSaveFace} />
    })
  }

  const handleSaveFace = async (state) => {

    await authedApi.editStaffFace({
      data: {
        ...state,
        starttime: moment(state.starttime).valueOf(),
        endtime: moment(state.endtime).valueOf(),
      }, faceidid: state.faceidid
    })

    const newFaces = faces.map(face => {
      return face.faceidid === state.faceidid
        ? { ...state } : { ...face }
    })
    setFaces(newFaces)
    hideModal()
    setSnackBar({
      message: "儲存成功",
      isOpen: true,
      severity: "success"
    })
  }

  return (
    <DetailCard
      title="頭像資訊"
      buttonText="新增"
      onClick={showAddFaceModal}
      style={{ marginBottom: 20 }}>
      {faces.length > 0 && <SimpleTable
        columns={
          [
            { key: 'avatar', label: t('avatar') },
            { key: 'cardnumber', label: t('cardnumber') },
            { key: 'starttimeFormat', label: t('starttime') },
            { key: 'endtimeFormat', label: t('endtime') },
          ]}
        data={faces}
        actions={[
          { name: t('edit'), onClick: (e, row) => handleEditFace(row), icon: <ExitToApp /> },
          { name: t('delete'), onClick: (e, row) => showDeleteFaceConfirm(row), icon: <Delete /> },
        ]}
      />}
    </DetailCard>
  )
}