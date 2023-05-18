import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from "../../contexts/AuthContext";
import { LocaleContext } from "../../contexts/LocaleContext";

import Table from "../../components/Table";
import Modal from '../../components/Modal';

import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import TablePagination from '@material-ui/core/TablePagination';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    // marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function Devices() {
  //   const classes = useStyles();
  //   const md5 = require("md5");
  //   const history = useHistory();
  const { t } = useContext(LocaleContext);
  const { authedApi } = useContext(AuthContext);

  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    order: 'asc',
    orderBy: '',
    page: 0,
    limit: 5
  });
  const [deviceGroups, setDeviceGroups] = React.useState([])

  const [staffGroups, setStaffGroups] = React.useState([])
  const [staffGroupsTotal, setStaffGroupsTotal] = React.useState(0);
  const [staffGroupsFilter, setStaffGroupsFilter] = React.useState({
    page: 0,
    limit: 50
  });

  const [accessStaffGroupIds, setAccessStaffGroupIds] = React.useState([])

  const [staffs, setStaffs] = React.useState([])

  const [staffGroupModal, setStaffGroupModal] = React.useState({
    isOpen: false
  });
  const [staffModal, setStaffModal] = React.useState({
    isOpen: false
  });

  React.useEffect(() => {
    (async () => {
      const { result, total } = await authedApi.getDevcieGroupList({ ...filter, page: filter.page + 1 })

      const tableData = result.map(data => ({
        ...data,
        id: data.groupid,
        device: data.id.join(', ')
      }))
      setTotal(total)
      setDeviceGroups(tableData)

    })();
  }, [filter])

  React.useEffect(() => {
    (async () => {
      if (staffGroupModal.isOpen) {
        const { result: result_, total } = await authedApi.getStaffGroupList({ ...staffGroupsFilter, page: staffGroupsFilter.page + 1 })

        setStaffGroupsTotal(total)

        const staffGroups = result_.map((data, sn) => ({
          ...data,
          sn
        }))

        const { result } = await authedApi.getAccessGroupListById({ page: staffGroupsFilter.page + 1, groupid: staffGroupModal.group.groupid, limit: staffGroupsFilter.limit })

        const accessids = result.map(dg => dg.staffgroupid)

        setAccessStaffGroupIds(accessids)

        const accessStaffGroup = staffGroups.map(pg => ({
          ...pg,
          groupid: staffGroupModal.group.groupid,
          isModified: false,
          operation: accessids.includes(pg.staffgroupid) ? "update" : "detete"
        }))

        setStaffGroups(accessStaffGroup)
      }

    })();
  }, [staffGroupsFilter, staffGroupModal])

  const handleDeviceGroupAccessStaff = async (e, group) => {
    e.stopPropagation()
    const { result: result_ } = await authedApi.getStaffList({ ...filter, page: filter.page + 1 })

    const staffs = result_.map((data, sn) => ({
      ...data,
      sn
    }))

    const { result } = await authedApi.getAccessGroupListById({ ...filter, page: filter.page + 1, groupid: group.groupid, limit: 50 })
    console.log(staffs)
    const accessids = result.map(dg => dg.staffgroupid)
  }
  const handleDeviceGroupAccessStaffGroup = async (e, group) => {
    e.stopPropagation()


    setStaffGroupModal({
      isOpen: true,
      group
    })
  }

  const handleClickGroup = (e, staffgroupid) => {
    const updateAccessStaffGroup = staffGroups.map(pg => {
      return pg.staffgroupid === staffgroupid
        ?
        {
          ...pg,
          isModified: true,
          operation: e.target.checked ? "update" : "delete"
        } : { ...pg }
    })

    setStaffGroups(updateAccessStaffGroup)
  }

  const handleUpdateDeviceGroupAccess = async () => {
    var data = staffGroups
      .filter(sg => sg.isModified)
      .map(sg => ({
        sn: sg.sn,
        operation: sg.operation,
        groupid: sg.groupid,
        staffgroupid: sg.staffgroupid
      }))

    await authedApi.addAccess({ data })

    setStaffGroupModal({
      isOpen: false
    })


  }

  const handleChangePage = (event, newPage) => {
    setStaffGroupsFilter({
      ...staffGroupsFilter,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setStaffGroupsFilter({
      ...staffGroupsFilter,
      limit: parseInt(event.target.value, 10),
      page: 0
    });
  };


  return (
    <React.Fragment>
      <Table
        data={deviceGroups}
        total={total}
        title={t('sider/devices')}
        filter={filter}
        setFilter={setFilter}
        columns={[
          { key: 'name', label: t('name') },
          { key: 'locationid', label: t('location') },
          { key: 'device', label: t('device') },
        ]}
        actions={[
          { name: '群組權限', onClick: handleDeviceGroupAccessStaffGroup, icon: <GroupIcon /> },
          { name: '人員權限', onClick: handleDeviceGroupAccessStaff, icon: <PersonIcon /> },
        ]}
      />
      <Modal
        title={"設備群組 > 人員群組"}
        open={staffGroupModal.isOpen}
        maxWidth="xs"
        onClose={() => setStaffGroupModal({
          isOpen: false
        })}
        onConfirm={handleUpdateDeviceGroupAccess}
      >
        <FormGroup>
          {
            staffGroups.map((staffGroup) =>
              <FormControlLabel
                key={staffGroup.staffgroupid}
                control={
                  <Checkbox
                    checked={staffGroup.operation === "update"}
                    onChange={e => handleClickGroup(e, staffGroup.staffgroupid)}
                    name={staffGroup.name}
                  />
                }
                label={staffGroup.name}
              />
            )
          }
        </FormGroup>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage={t('labelRowsPerPage')}
          component="div"
          count={staffGroupsTotal}
          rowsPerPage={staffGroupsFilter.limit}
          page={staffGroupsFilter.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Modal>
    </React.Fragment>
  );
}
