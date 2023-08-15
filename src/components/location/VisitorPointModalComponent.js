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
  TextField,
  MenuItem,
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
    height: 620,
    backgroundColor: '#fff',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: 12
  },
  contentInner: {
    height: 505,
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
  info: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    height: 45,
    marginBottom: 5,
    // margin: '6px 12px',
    '& > *': {
      flex: 1
    },
  }
}));

const limit = 12

export default ({
  visitorpoint = {
    name: "",
    locationid: "",
    item: []
  },
  onSave,
  authedApi,
}) => {
  // console.log(visitorpoint)
  const { t } = useContext(LocaleContext);

  // const { authedApi } = useContext(AuthContext);
  const classes = useStyles();
  const [items, setItems] = React.useState([])
  const [state, setState] = React.useState({ ...visitorpoint })
  const [total, setTotal] = React.useState(0)
  const [filter, setFilter] = React.useState({
    page: 0,
    keyword: ""
  })
  React.useEffect(() => {
    (async () => {
      const { result, total } = await authedApi.postStaffGroupList({
        data: {
          priority_list: visitorpoint.item.map(_id => Number(_id))
        }, page: filter.page + 1, keyword: filter.keyword, limit
      })
      let _items = result.map(item => ({
        ...item,
        _id: String(item.staffgroupid)
      }))
      setTotal(total)
      setItems(_items)
    })()
  }, [filter])

  const handleChange = (event) => {
    let newItem = [...state.item]
    if (event.target.checked) {
      newItem.push(event.target.name)
    } else {
      newItem = newItem.filter(state => state !== event.target.name)
    }
    setState({
      ...state,
      item: newItem
    })
  };

  return (
    <div className={classes.content}>
      <div className={classes.info}>
        <Text required>{t('name')}</Text>
        <TextField
          value={state.name || ''}
          onChange={e => setState({
            ...state,
            name: e.target.value
          })}
        />
      </div><div className={classes.info}>
        <SearchTextField style={{ flex: 'unset' }} placeholder={t("search-keyword")} value={filter.keyword} onChange={e => setFilter({ ...filter, keyword: e.target.value })} />
      </div>
      <div className={classes.contentInner}>
        {
          items.map((item) => <div key={item._id} className={classes.contentInnerItem}>
            <FormControlLabel
              style={{ width: '100%', margin: 0, height: '100%' }}
              control={
                <Checkbox
                  checked={state.item.includes(item._id)}
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
      <div style={{ width: '100%', paddingTop: 10 }}>
        <Button
          style={{ float: 'right' }}
          variant="contained"
          onClick={() => onSave(state)} color="primary">{t("save")}</Button>
      </div>
    </div>
  )
}