import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Select from "../../components/Select"
import { LocaleContext } from "../../contexts/LocaleContext";
import { Checkbox, FormControlLabel, TablePagination } from '@material-ui/core';
import SearchTextField from "../common/SearchTextField"

import {
  // Paper,
  // Divider,
  Button,
} from '@material-ui/core'

import Text from "../Text"

const viewBackgroundColor = "#e5e5e5"

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    // padding: theme.spacing(2)
  },
  content: {
    width: 500,
    height: 565,
    backgroundColor: '#fff',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: 12
  },
  contentInner: {
    flex: 1,
    marginTop: 10,
    backgroundColor: viewBackgroundColor,
    display: 'flex',
    flexWrap: 'wrap',
    // justifyContent: 'space-around',
    alignItems: 'flex-start',
    alignContent: 'flex-start'
  },
  contentInnerItem: {
    width: 'calc(50% - 12px)',
    height: 50,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 8,
    // marginRight: 8,
    marginTop: 8,
    borderRadius: 5
  },
}));
const limit = 12

export default ({
  mode = "dtos",
  leftTabIndex = 0,
  rightTabIndex = 0,
  onSave,
  isExisted = [],
  authedApi }) => {
  const { t } = useContext(LocaleContext);
  // const { authedApi } = useContext(AuthContext);
  const classes = useStyles();
  const [items, setItems] = React.useState([])
  const [state, setState] = React.useState([])
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(0)
  const [filter, setFilter] = React.useState({
    page: 0,
    keyword: ""
  })
  React.useEffect(() => {
    (async () => {

      if (mode === "dtos") {
        if (rightTabIndex === 0) {
          const { result, total } = await authedApi.postStaffList({ data: { priority_list: isExisted }, page: filter.page + 1, keyword: filter.keyword, limit })
          let _items = result.map(item => ({
            ...item,
            _id: String(item.staffid)
          }))
          setTotal(total)
          setItems(_items)
        }
        else {
          const { result, total } = await authedApi.postStaffGroupList({ data: { priority_list: isExisted }, page: filter.page + 1, keyword: filter.keyword, limit })
          let _items = result.map(item => ({
            ...item,
            _id: String(item.staffgroupid)
          }))
          setTotal(total)
          setItems(_items)
        }
      } else {
        if (rightTabIndex === 0) {
          const { result, total } = await authedApi.postDeviceList({ data: { priority_list: isExisted }, page: filter.page + 1, keyword: filter.keyword, limit })
          let _items = result.map(item => ({
            ...item,
            _id: String(item.id)
          }))
          setTotal(total)
          setItems(_items)
        }
        else {
          const { result, total } = await authedApi.postDeviceGroupList({ data: { priority_list: isExisted }, page: filter.page + 1, keyword: filter.keyword, limit })
          let _items = result.map(item => ({
            ...item,
            _id: String(item.groupid)
          }))
          setTotal(total)
          setItems(_items)
        }
      }
    })()
  }, [filter])

  const handleChange = (event) => {
    let newState = [...state]
    if (event.target.checked) {
      newState.push(event.target.name)
    } else {
      newState = newState.filter(state => state !== event.target.name)
    }
    setState(newState)
  };

  return (
    <div className={classes.content}>
      <div>
        <SearchTextField style={{ flex: 'unset' }} placeholder={"搜尋關鍵字"} value={filter.keyword} onChange={e => setFilter({ ...filter, keyword: e.target.value })} /></div>
      <div className={classes.contentInner}>
        {
          items.map((item) => <div key={item._id} className={classes.contentInnerItem}>
            <FormControlLabel
              style={{ width: '100%', margin: 0, height: '100%' }}
              control={
                <Checkbox
                  disabled={isExisted.includes(Number(item._id))}
                  checked={state.includes(item._id)}
                  onChange={handleChange}
                  name={item._id}
                  color="primary"
                />
              }
              label={item.name}
            />
          </div>)
        }
      </div>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={total}
        rowsPerPage={limit}
        page={filter.page}
        onPageChange={(event, newPage) => setFilter({
          ...filter,
          page: newPage
        })}
      />
      <div style={{ width: '100%', paddingTop: 10, paddingBottom: 20 }}>
        <Button
          style={{ float: 'right' }}
          variant="contained"
          onClick={() => onSave(state)} color="primary">Save</Button>
      </div>
    </div>
  )
}