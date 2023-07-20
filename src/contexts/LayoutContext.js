import React, { useState, createContext } from 'react'
import Alert from '@material-ui/lab/Alert';

import {
  Snackbar,
} from '@material-ui/core'
import ConfirmDialog from "../components/ConfirmDialog_"

const LayoutContext = createContext();

function LayoutProvider({ children, ...rest }) {

  const [modal, setModal] = useState({
    title: "",
    component: <></>,
    isOpen: false,
    onConfirm: () => { },
    size: "sm"
  })

  const [snackBar, setSnakcBar] = useState({
    isOpen: false,
    severity: 'info',
    message: ''
  })

  const showModal = ({ title = "", component = <></>, onConfirm = () => { }, size = "sm" }) => {
    setModal({
      title,
      component,
      isOpen: true,
      onConfirm,
      size
    })
  }

  const hideModal = () => {
    setModal({
      title: "",
      component: <></>,
      isOpen: false,
      onConfirm: () => { },
      size: "sm"
    })
  }

  const value = {
    setSnakcBar,
    modal,
    showModal,
    hideModal
  };

  return <LayoutContext.Provider
    {...rest}
    value={value}>
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={snackBar.isOpen}
      autoHideDuration={3000}
      onClose={() => setSnakcBar({
        isOpen: false,
        severity: 'info',
        message: ''
      })}>
      <Alert
        elevation={6}
        variant="filled"
        onClose={() => setSnakcBar({
          isOpen: false,
          severity: 'info',
          message: ''
        })} severity={snackBar.severity}>
        {snackBar.message}
      </Alert>
    </Snackbar>

    <ConfirmDialog
      title={modal.title}
      open={modal.isOpen}
      maxWidth={modal.size}
      onConfirm={modal.onConfirm}
      onClose={hideModal}
    >
      {modal.component}
    </ConfirmDialog>
    {children}
  </LayoutContext.Provider>;
}

export { LayoutContext, LayoutProvider };