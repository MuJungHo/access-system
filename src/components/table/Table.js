import React, { useContext, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


// import SearchIcon from "@material-ui/icons/Search"
import TableChartIcon from '@material-ui/icons/TableChart';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import SearchTextField from "../common/SearchTextField";

import Actions from "./Actions"
import TableActions from "./TableActions"
import { DateRangePicker } from 'rsuite';
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import moment from 'moment'

const ColumnManageDialog = ({
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

const arrayMove = (arr, old_index, new_index) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
};


const Card = ({ column, index, handleChange, moveCard }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'card',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { index, type: "card" },
    type: "card",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.5 : 1;

  drag(drop(ref))

  return (
    <div
      ref={ref}
      style={{ opacity, display: 'flex', alignItems: 'center', width: '100%' }}
    >
      <DragHandleIcon style={{ cursor: 'move' }} />
      <span style={{ flex: 1, fontSize: 14, lineHeight: '14px', marginLeft: 20 }}>{column.label}</span>
      <Switch color="primary" checked={column.enable || false} onChange={(e) => handleChange(e, column.key)} name={column.key} />
    </div>
  )
}

function EnhancedTableHead(props) {
  const { t } = useContext(LocaleContext);
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columns, actions, allowSelect } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {allowSelect && <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>}
        {columns.map((column) => (
          column.enable && <TableCell
            align={'left'}
            padding={'normal'}
            sortDirection={orderBy === column.key ? order : false}
            key={column.key}
          >
            <TableSortLabel
              active={orderBy === column.key}
              direction={orderBy === column.key ? order : 'asc'}
              onClick={createSortHandler(column.key)}
              disabled={!!!column.sortable}
            >
              {column.label}
            </TableSortLabel>
          </TableCell>
        ))}
        {actions.length > 0 && <TableCell align="left">{t('actions')}</TableCell>}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    display: 'flex',
    // paddingTop: 8,
    // paddingBottom: 8
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = ({
  numSelected,
  setFilter,
  filter,
  dateRangePicker,
  columns,
  setColumns,
  tableKey,
  filterComponent,
  tableActions,
  selected,
  setSelected,
  handleBatchDeleteConfirm
}) => {
  const classes = useToolbarStyles();
  const ref = useRef()
  const [columnModal, setColumnModal] = React.useState({
    isOpen: false
  });
  const [modalColumns, setModalColumns] = React.useState([...columns])

  const { showWarningConfirm } = useContext(LayoutContext);
  const { t } = useContext(LocaleContext);
  const { authedCustomize, editAuthedUserCustomize } = useContext(AuthContext);

  const handleChange = (event, key) => {
    const updateColumns = modalColumns.map(column => column.key === key ? { ...column, enable: event.target.checked } : { ...column })
    setModalColumns(updateColumns);
  };

  const moveCard = (dragIndex, hoverIndex) => {
    const dragColumns = arrayMove([...modalColumns], dragIndex, hoverIndex)
    setModalColumns([...dragColumns])
  }

  const handleEditTableColumns = async () => {
    const customize = { ...authedCustomize }
    customize[tableKey] = modalColumns.map(column => ({ key: column.key, enable: column.enable }))
    await editAuthedUserCustomize(customize)
    setColumns([...modalColumns])
    setColumnModal({
      isOpen: false
    })
  }

  const nowDateStartTime = moment(filter.start).unix() * 1000
  const nowDateEndTime = moment(filter.end).unix() * 1000

  const actions = [...tableActions,
  { name: "欄位管理", onClick: () => setColumnModal({ isOpen: true }), icon: <TableChartIcon /> }]

  const showBatchDeleteConfirm = () => {
    showWarningConfirm({
      title: '批次刪除',
      component: <h6 style={{ margin: 16 }}>{`確認刪除${selected.length}筆資料?`}</h6>,
      onConfirm: () => {
        handleBatchDeleteConfirm(selected)
        setSelected([])
      }
    })
  }

  return (
    <Toolbar
      className={clsx(classes.toolbar, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
          <React.Fragment>
            <form
              onSubmit={e => {
                e.preventDefault()
                setFilter({
                  ...filter,
                  keyword: ref.current.value
                })
              }}>
              <SearchTextField
                inputRef={ref}
                style={{ width: 270 }}
                placeholder={t('keyword')}
              />
            </form>
            {dateRangePicker && <DateRangePicker
              locale={t("daterangepicker")}
              style={{ marginLeft: 20 }}
              placement="auto"
              value={[new Date(nowDateStartTime), new Date(nowDateEndTime)]}
              onChange={e => {
                setFilter({
                  ...filter,
                  page: 0,
                  start: moment(e[0]).startOf('date').valueOf(),
                  end: moment(e[1]).endOf('date').valueOf()
                })
              }} />}
          </React.Fragment>
        )}
      {numSelected === 0 && filterComponent}
      <div style={{ flex: 1 }}></div>
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={showBatchDeleteConfirm}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
          <TableActions actions={actions} />
        )
      }

      <ColumnManageDialog
        title={'欄位管理'}
        open={columnModal.isOpen}
        maxWidth="xs"
        onConfirm={handleEditTableColumns}
        onClose={() => setColumnModal({
          isOpen: false
        })}
      >

        <FormControl component="fieldset" fullWidth>
          <FormGroup>
            {
              modalColumns.map((column, index) =>
                <Card
                  key={column.key}
                  index={index}
                  column={column}
                  handleChange={handleChange}
                  moveCard={moveCard}
                />)
            }

          </FormGroup>
        </FormControl>
      </ColumnManageDialog>
    </Toolbar>
  );
};

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


export default ({
  data,
  columns: columns_,
  total,
  filter,
  setFilter,
  actions = [],
  tableActions = [],
  dateRangePicker = false,
  allowSelect = false,
  tableKey,
  maxHeight = 'calc(100vh - 225px)',
  filterComponent = <></>,
  handleBatchDeleteConfirm = () => { }
}) => {
  const classes = useStyles();
  const { t } = useContext(LocaleContext);
  const { authedCustomize } = useContext(AuthContext);

  const initColumns = authedCustomize[tableKey]
    ? authedCustomize[tableKey].map(column => {
      const foundColumn = columns_.find(column_ => column_.key === column.key) || {}
      return { ...column, sortable: foundColumn.sortable || false, label: foundColumn.label || t(column.key) }
    })
    : columns_

  const [selected, setSelected] = React.useState([]);
  const [columns, setColumns] = React.useState(initColumns)
  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleRequestSort = (event, property) => {
    const isAsc = filter.orderBy === property && filter.order === 'asc';
    setFilter({
      ...filter,
      order: isAsc ? 'desc' : 'asc',
      orderBy: property
    })
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    if (!allowSelect) return
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setFilter({
      ...filter,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setFilter({
      ...filter,
      limit: parseInt(event.target.value, 10),
      page: 0
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classes.root}>
        <EnhancedTableToolbar
          columns={columns}
          setColumns={setColumns}
          filter={filter}
          setFilter={setFilter}
          selected={selected}
          numSelected={selected.length}
          dateRangePicker={dateRangePicker}
          tableKey={tableKey}
          filterComponent={filterComponent}
          tableActions={tableActions}
          setSelected={setSelected}
          handleBatchDeleteConfirm={handleBatchDeleteConfirm}
        />
        <TableContainer style={{ maxHeight }}>
          <Table
            className={classes.table}
            size={'medium'}
            stickyHeader
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={filter.order}
              orderBy={filter.orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              columns={columns}
              actions={actions}
              allowSelect={allowSelect}
            />
            <TableBody>
              {data.map(row => {
                const isItemSelected = isSelected(row.id);
                const labelId = row.id;

                return (
                  <TableRow
                    hover
                    style={{ height: 63 }}
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    {allowSelect && <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>}
                    {columns.map((column) => (
                      column.enable && <TableCell
                        key={column.key}
                        align="left"
                        width={column.width}
                      >
                        {row[column.key]}
                      </TableCell>
                    ))}
                    {actions?.length > 0 && <TableCell align="left">
                      <Actions actions={actions} row={row} />
                    </TableCell>}
                  </TableRow>
                );
              })}
              {/* {emptyRows > 0 && (
              <TableRow style={{ height: 63 * emptyRows }}>
                <TableCell colSpan={columns.length} />
              </TableRow>
            )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage={t('labelRowsPerPage')}
          component="div"
          count={total}
          rowsPerPage={filter.limit}
          page={filter.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div >
    </DndProvider>
  );
}
