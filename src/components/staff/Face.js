import React, { useContext } from "react";
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { AuthContext } from "../../contexts/AuthContext";
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment'
import DetailCard from "../DetailCard";
import SimpleTable from "../table/SimpleTable"
import FaceModalComponent from "./FaceModalComponent"
import {
  // Paper,
  // Divider,
  // Button,
  // MenuItem,
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
  const { setSnackBar, showModal, hideModal } = useContext(LayoutContext);
  const [FRSDevices, setFRSDevices] = React.useState([])

  // const classes = useStyles();

  React.useEffect(() => {
    (async () => {
      const { result } = await authedApi.getDeviceList({
        category: "FRS"
        , limit: 10000
        , page: 1
      })
      let options = result.map(c => ({ value: c.id, label: c.name }))
      setFRSDevices(options)
    })()
  }, [])

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
      onClick={() => { }}
      style={{ marginBottom: 20 }}>
      {faces.length > 0 && <SimpleTable
        columns={
          [
            { key: 'avatar', label: t('avatar') },
            { key: 'cardnumber', label: t('cardnumber') },
            { key: 'starttime', label: t('starttime') },
            { key: 'endtime', label: t('endtime') },
          ]}
        data={faces}
        actions={[
          { name: t('edit'), onClick: (e, row) => handleEditFace(row), icon: <ExitToApp /> },
          { name: t('delete'), onClick: (e, row) => { }, icon: <Delete /> },
        ]}
      />}
    </DetailCard>
  )
}