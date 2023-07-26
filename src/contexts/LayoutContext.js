import React, { useState, createContext } from 'react'
import Alert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import ConfirmDialog from '../components/ConfirmDialog'
import {
  Snackbar,
  Divider
} from '@material-ui/core'

import Dialog from '@material-ui/core/Dialog';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const LayoutContext = createContext();

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

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

  const showModal = ({ title = "", component = <></> }) => {
    setModal({
      title,
      component,
      isOpen: true
    })
  }

  const hideModal = () => {
    setModal({
      ...modal,
      isOpen: false
    })
  }

  const showConfirm = ({ title = "", component = <></>, onConfirm = () => { } }) => {
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
    showConfirm
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
    <Dialog onClose={hideModal} open={modal.isOpen}>
      <DialogTitle onClose={hideModal}>
        {modal.title}
      </DialogTitle>
      <Divider />
      {modal.component}
    </Dialog>
    <ConfirmDialog
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