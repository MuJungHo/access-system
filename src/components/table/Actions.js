import React from "react";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  menu: {
    "& .MuiPaper-root": {
      boxShadow: theme.shadows[1],
    }
  },
  list: {
    padding: 5,
  },
  item: {
    height: 40,
    minWidth: 60,
    paddingLeft: theme.spacing(1),
    '& > *:not(:first-child)': {
      marginLeft: 20
    },
    '& svg': {
      fill: theme.grey.medium
    }
  },
}));
export default ({ actions = [], row }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleActionClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleItemClick = (event, action) => {
    setAnchorEl(null)
    action.onClick(event, row)
  }
  if (actions.length === 1) return (
    <div onClick={(event) => actions[0].onClick(event, row)}>
      {actions[0].icon}
    </div>
  )
  return (
    <div onClick={e => e.stopPropagation()}>
      <SettingsIcon onClick={handleActionClick} />
      <Menu
        open={Boolean(anchorEl)}
        className={classes.menu}
        classes={{ list: classes.list }}
        anchorEl={anchorEl}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {
          actions.map(action => {
            const isShow = typeof action.show === "function" && action.show(row) || action.show === undefined
            return isShow && <MenuItem
              key={action.name}
              onClick={(event) => handleItemClick(event, action)}
              className={classes.item}
            >
              {action.icon ? action.icon : null}
              <Typography color="textSecondary" variant="caption">{action.name}</Typography>
            </MenuItem>
          }
          )
        }

      </Menu>
    </div>
  );
};