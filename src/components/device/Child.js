import React, { useContext } from "react";
// import TextField from '@material-ui/core/TextField';
import { LocaleContext } from "../../contexts/LocaleContext";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import DetailCard from "./DetailCard";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {
  Paper,
  Divider,
  Button,
  MenuItem
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  },
  table: {
    minWidth: 600
  }
}));

export default ({
  childDevices
}) => {
  const { t } = useContext(LocaleContext);
  const classes = useStyles();
  
  return (
    <DetailCard title="關聯設備" style={{ marginBottom: 20 }}>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Model Name</TableCell>
              <TableCell>Mac</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {childDevices.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.config.DeviceConfiguration.DeviceSetting.ModelName}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.config.DeviceConfiguration.DeviceSetting.Mac}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DetailCard>
  )
}
