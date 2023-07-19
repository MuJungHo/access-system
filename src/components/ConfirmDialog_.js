import React, { useContext } from 'react'
import { LocaleContext } from "../contexts/LocaleContext";

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
  const { t } = useContext(LocaleContext);
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
          {t("close")}
        </Button>
        {typeof onConfirm === 'function' && <Button variant="contained" color="primary"
          onClick={onConfirm}>
          {t("confirm")}
        </Button>}
      </DialogActions>
    </Dialog>)
}