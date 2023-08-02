import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';


export default withStyles(theme => ({
  root: {
    // width: '30%',
    boxShadow: theme.shadows[1],
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    // "& .MuiOutlinedInput-notchedOutline": {
    //   borderColor: 'rgba(190, 190, 190, 0.4)'
    // }
  }
}))((props) => <Tabs {...props} />)
