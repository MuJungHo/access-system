import React from 'react'

import {
  DialogActions,
  Dialog,
  Button,
  Divider
} from '@material-ui/core'
import { palette } from '../customTheme'
import { DialogTitle } from "./DialogTitle"

export default ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  maxWidth,
  warning = false
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
    >
      <DialogTitle warning={warning} onClose={onClose}>{title}</DialogTitle>
      <Divider />
      {children}
      <DialogActions style={{ padding: 16 }}>
        <Button color="default"
          onClick={onClose}>
          Close
        </Button>
        {typeof onConfirm === 'function' && <Button variant="contained" color="primary"
          style={{ backgroundColor: palette.error.main }}
          onClick={onConfirm}>
          Confirm
        </Button>}
      </DialogActions>
    </Dialog>)
}