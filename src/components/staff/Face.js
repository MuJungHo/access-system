import React, { useContext } from "react";
import { useParams } from "react-router-dom"
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { AuthContext } from "../../contexts/AuthContext";
import moment from 'moment'
import DetailCard from "../DetailCard";
import SimpleTable from "../table/SimpleTable"
import FaceModalComponent from "./FaceModalComponent"
import {
  Avatar,
} from '@material-ui/core'

import {
  Delete,
  ExitToApp
} from '@material-ui/icons';

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
      title: t("add-thing", { thing: t("card-identification") }),
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
      message: t("saveSucceed"),
      isOpen: true,
      severity: "success"
    })
  }

  const showDeleteFaceConfirm = (row) => {
    showWarningConfirm({
      title: t("delete-thing", { thing: t("face-identification") }),
      component: <h6 style={{ margin: 16 }}>{t("confirm-delete-thing", { thing: row.cardnumber })}</h6>,
      onConfirm: () => handleDeleteFace(row.faceidid)
    })
  }

  const handleDeleteFace = async (faceidid) => {
    await authedApi.deleteStaffFace({ faceidid })
    const newFaces = faces.filter(card => card.faceidid !== faceidid)
    setFaces(newFaces)
    setSnackBar({
      message: t("deleteSucceed"),
      isOpen: true,
      severity: "success"
    })
    // console.log(faceidid)
  }

  const handleEditFace = (row) => {
    // console.log(row)
    showModal({
      title: t("edit-thing", { thing: t("face-identification") }),
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
      message: t("saveSucceed"),
      isOpen: true,
      severity: "success"
    })
  }

  return (
    <DetailCard
      title={t("face-identification")}
      buttonText={t("add")}
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