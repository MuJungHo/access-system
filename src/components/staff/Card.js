import React, { useContext } from "react";
// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { AuthContext } from "../../contexts/AuthContext";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import SimpleTable from "../table/SimpleTable"
import DetailCard from "../DetailCard";
import CardModalComponent from "./CardModalComponent"
import moment from 'moment'
import {
  // Paper,
  // Divider,
  // Button,
  MenuItem
} from '@material-ui/core'

import {
  Close,
  ExitToApp
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  }
}));

export default ({
  cards = [],
  setCards
}) => {
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);
  const { setSnackBar, showModal } = useContext(LayoutContext);
  // const classes = useStyles();

  // React.useEffect(() => {
  //   (async () => {

  //   })()
  // }, [])

  const handleShowEditCardModal = (row) => {
    // console.log(row)
    showModal({
      title: "編輯卡片資訊",
      component: <CardModalComponent
        card={row}
        onSave={handleSaveCard} />
    })
  }

  const handleSaveCard = () => {

  }

  const showAddCardModal = () => {
    // console.log(row)
    showModal({
      title: "新增卡片資訊",
      component: <CardModalComponent
        card={{}}
        onSave={handleAddCard} />
    })
  }

  const handleAddCard = () => {

  }


  return (
    <DetailCard
      title="卡片資訊"
      buttonText="新增"
      onClick={showAddCardModal}
      style={{ marginBottom: 20 }}>
      {cards.length > 0 && <SimpleTable
        columns={
          [
            { key: 'card_type', label: t('cardtype') },
            { key: 'card_number', label: t('cardnumber') },
            { key: 'starttimeFormat', label: t('starttime') },
            { key: 'endtimeFormat', label: t('endtime') },
          ]}
        data={cards}
        actions={[
          { name: t('edit'), onClick: (e, row) => handleShowEditCardModal(row), icon: <ExitToApp /> },
          { name: t('delete'), onClick: (e, row) => { }, icon: <Close /> },
        ]}
      />}
    </DetailCard>
  )
}