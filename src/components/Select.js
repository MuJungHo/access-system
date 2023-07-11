import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

import {
  FormControl,
  Select,
  InputLabel,
  MenuItem
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 200,
    "& .MuiInputLabel-formControl": {
      top: -8
    },
    "& .MuiOutlinedInput-input": {
      color: "rgba(0, 0, 0, 0.4)",
      padding: 10
    },
    // "& .MuiInputLabel-root": {
    //   color: "green"
    // },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(190, 190, 190, 0.4)"
    },
    // "&:hover .MuiOutlinedInput-input": {
    //   color: theme.palette.primary.main
    // },
    // "&:hover .MuiInputLabel-root": {
    //   color: theme.palette.primary.main
    // },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
      transition: 'border-color ease-in-out 0.3s'
    }
  }
}));


export default ({
  label,
  children,
  value,
  onChange,
  style = {}
}) => {
  const classes = useStyles()
  return (
    <FormControl
      style={{ ...style }}
      className={classes.root}
      variant="outlined"
    >
      <InputLabel id="select-label">{label}</InputLabel>
      <Select
        labelId="select-label"
        value={value}
        onChange={onChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {children}
      </Select>
    </FormControl>)
}