import React from "react";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from "@material-ui/icons/Search"

export default withStyles(theme => ({
  root: {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: 'rgba(190, 190, 190, 0.4)'
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
      transition: 'border-color ease-in-out 0.3s'
    },
    '&::placeholder': {
      fontSize: '1rem'
    },
    '& .MuiFormLabel-root': {
      fontSize: '1.2rem'
    },
    '& span': {
      color: theme.palette.error.main
    },
    '& .MuiInputBase-root': {
      height: 36
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 6
    },
    flex: '1 1 auto'
  }
}))((props) => <TextField
  type="search"
  variant="outlined"
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <SearchIcon />
      </InputAdornment>
    )
  }}
  {...props} inputProps={{
    style: {
      ...props.style,
      fontSize: '1rem',
      fontWeight: 400,
      padding: '.5rem',
    }
  }} />)