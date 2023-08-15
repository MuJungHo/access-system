import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom"
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { AuthContext } from "../../contexts/AuthContext";
import SimpleTable from "../table/SimpleTable"
import DetailCard from "../DetailCard";
import CardModalComponent from "./CardModalComponent"
import moment from 'moment'

import {
  Delete,
  ExitToApp
} from '@material-ui/icons';

export default ({
  cards = [],
  setCards
}) => {
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);
  const { setSnackBar, showModal, showWarningConfirm, hideModal } = useContext(LayoutContext);
  const { staffid } = useParams();
  
  const handleShowEditCardModal = (row) => {
    // console.log(row)
    showModal({
      title: t("edit-thing", { thing: t("card-identification") }),
      component: <CardModalComponent
        card={row}
        onSave={handleSaveCard} />
    })
  }

  const handleSaveCard = async (state) => {
    await authedApi.editStaffCard({
      data: {
        ...state,
        starttime: moment(state.starttimeFormat).valueOf(),
        endtime: moment(state.endtimeFormat).valueOf(),
      }, cardidid: state.cardidid
    })
    const newCards = cards.map(card => {
      return card.cardidid === state.cardidid
        ? { ...state } : { ...card }
    })
    setCards(newCards)
    hideModal()
    setSnackBar({
      message: t("saveSucceed"),
      isOpen: true,
      severity: "success"
    })
  }

  const showAddCardModal = () => {
    // console.log(row)
    showModal({
      title: t("add-thing", { thing: t("card-identification") }),
      component: <CardModalComponent
        card={{}}
        onSave={handleAddCard} />
    })
  }

  const showDeleteConfirmDialog = (row) => {
    showWarningConfirm({
      title: t("delete-thing", { thing: t("card-identification") }),
      component: <h6 style={{ margin: 16 }}>{t("confirm-delete-thing", { thing: row.card_number })}</h6>,
      onConfirm: () => handleDeleteCard(row.cardidid)
    })
  }

  const handleDeleteCard = async (cardidid) => {
    await authedApi.deleteStaffCard({ cardidid })
    const newCards = cards.filter(card => card.cardidid !== cardidid)
    setCards(newCards)
    setSnackBar({
      message: t("deleteSucceed"),
      isOpen: true,
      severity: "success"
    })
  }

  const handleAddCard = async (state) => {
    const { cardidid } = await authedApi.addStaff({
      data: {
        ...state,
        staffid: Number(staffid),
        starttime: moment(state.starttime).valueOf(),
        endtime: moment(state.endtime).valueOf(),
      }, type: 2
    })
    const newCards = [...cards, {
      id: cardidid,
      cardidid,
      enable: 1,
      card_type: state.card_type,
      card_number: state.card_number,
      em: state.card_type === "em" ? 1 : 0,
      mifare: state.card_type === "mifare" ? 1 : 0,
      uhf: state.card_type === "uhf" ? 1 : 0,
      emnumber: state.card_type === "em" ? state.card_number : "",
      mifarenumber: state.card_type === "mifare" ? state.card_number : "",
      uhfnumber: state.card_type === "uhf" ? state.card_number : "",
      endtime: moment(state.endtime).valueOf(),
      starttime: moment(state.starttime).valueOf(),
      starttimeFormat: moment(state.starttime).format('YYYY-MM-DD hh:mm:ss'),
      endtimeFormat: moment(state.endtime).format('YYYY-MM-DD hh:mm:ss'),
    }]
    setCards(newCards)
    hideModal()
    setSnackBar({
      message: t("saveSucceed"),
      isOpen: true,
      severity: "success"
    })
  }


  return (
    <DetailCard
      title={t("card-identification")}
      buttonText={t("add")}
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
          { name: t('delete'), onClick: (e, row) => showDeleteConfirmDialog(row), icon: <Delete /> },
        ]}
      />}
    </DetailCard>
  )
}