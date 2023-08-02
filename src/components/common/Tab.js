import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';


export default withStyles(theme => ({
  root: {
    // width: '30%',
    // "& .MuiOutlinedInput-notchedOutline": {
    //   borderColor: 'rgba(190, 190, 190, 0.4)'
    // }
  }
}))((props) => <Tab {...props} />)
