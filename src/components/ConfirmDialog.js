import React from 'react'

import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Button
} from '@material-ui/core'

export default ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  maxWidth
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions style={{ padding: 16 }}>
        <Button color="primary"
          onClick={onClose}>
          Close
        </Button>
        {typeof onConfirm === 'function' && <Button variant="contained" color="primary"
          onClick={onConfirm}>
          Confirm
        </Button>}
      </DialogActions>
    </Dialog>)
}