import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { LocaleContext } from "../../contexts/LocaleContext";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Actions from "./Actions"

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function BasicTable({
  data = [],
  columns = [],
  actions = [],
  component = Paper,
  style = {}
}) {
  const classes = useStyles();
  const { t } = useContext(LocaleContext);

  return (
    <TableContainer style={{ ...style }} component={component}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              columns.map(column => <TableCell key={column.key}>{column.label}</TableCell>)
            }
            {actions.length > 0 && <TableCell align="left">{t('actions')}</TableCell>}

          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {
                columns.map((column) => (
                  <TableCell
                    key={column.key}>
                    {row[column.key]}
                  </TableCell>))
              }
              {actions?.length > 0 && <TableCell align="left">
                <Actions actions={actions} row={row} />
              </TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}