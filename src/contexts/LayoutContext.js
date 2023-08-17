import React, { useState, createContext } from 'react'
import Alert from '@material-ui/lab/Alert';
import ConfirmDialog from '../components/ConfirmDialog'
import {
  Snackbar,
  Divider
} from '@material-ui/core'

import Dialog from '@material-ui/core/Dialog';
import { DialogTitle } from '../components/DialogTitle'

const LayoutContext = createContext();

function LayoutProvider({ children, ...rest }) {

  const [confirmDialog, setConfirmDialog] = useState({
    title: "",
    component: <></>,
    isOpen: false
  })

  const [modal, setModal] = useState({
    title: "",
    component: <></>,
    isOpen: false
  })

  const [snackBar, setSnackBar] = useState({
    isOpen: false,
    severity: 'info',
    message: ''
  })

  const showModal = ({
    title = "",
    component = <></>,
    maxWidth = "sm",
    fullWidth = false,
    fullScreen = false
  }) => {
    setModal({
      title,
      component,
      maxWidth,
      fullWidth,
      isOpen: true,
      fullScreen
    })
  }

  const hideModal = () => {
    setModal({
      ...modal,
      isOpen: false
    })
  }

  const showWarningConfirm = ({ title = "", component = <></>, onConfirm = () => { } }) => {
    setConfirmDialog({
      title,
      component,
      isOpen: true,
      onConfirm
    })
  }

  const handleConfirm = () => {
    confirmDialog.onConfirm()
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
  }

  const value = {
    setSnackBar,
    modal,
    showModal,
    hideModal,
    showWarningConfirm
  };

  return <LayoutContext.Provider
    {...rest}
    value={value}>
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={snackBar.isOpen}
      autoHideDuration={3000}
      onClose={() => setSnackBar({
        ...snackBar,
        isOpen: false,
      })}>
      <Alert
        elevation={6}
        variant="filled"
        onClose={() => setSnackBar({
          ...snackBar,
          isOpen: false,
        })} severity={snackBar.severity}>
        {snackBar.message}
      </Alert>
    </Snackbar>
    <Dialog
      onClose={hideModal}
      open={modal.isOpen}
      fullWidth={modal.fullWidth}
      fullScreen={modal.fullScreen}
      maxWidth={modal.maxWidth}>
      <DialogTitle onClose={hideModal}>
        {modal.title}
      </DialogTitle>
      <Divider />
      {modal.component}
    </Dialog>
    <ConfirmDialog
      warning
      title={confirmDialog.title}
      open={confirmDialog.isOpen}
      maxWidth={confirmDialog.maxWidth}
      onConfirm={handleConfirm}
      onClose={() => setConfirmDialog({
        ...confirmDialog,
        isOpen: false
      })}>
      {confirmDialog.component}
    </ConfirmDialog>
    {children}
  </LayoutContext.Provider>;
}

export { LayoutContext, LayoutProvider };