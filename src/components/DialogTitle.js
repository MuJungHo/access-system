import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

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
  warningButton: {
    position: 'absolute',
    left: theme.spacing(2),
    top: 19,
    color: theme.palette.warning.main,
  }
})

export const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, warning = false, ...other } = props;
  return (
    <MuiDialogTitle disableTypography style={{ paddingLeft: warning ? 48 : undefined }} className={classes.root} {...other} >
      {
        warning && <WarningIcon className={classes.warningButton} />
      }
      <Typography variant="h6">{children}</Typography>
      {
        onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null
      }
    </MuiDialogTitle >
  );
});