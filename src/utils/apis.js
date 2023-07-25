import axios from 'axios'
const md5 = require("md5");

export const instance = axios.create({
  baseURL: `http://${process.env.REACT_APP_DOMAIN}/cgi-bin`,
  timeout: 30000
})

export const api = (token, logout, setSnackBar, t) => {
  const timestamp = Date.now()
  const sign = md5(timestamp + '#' + token)

  const promise_ = (instance_) => {
    return new Promise((response, reject) => {
      instance_
        .then((data) => {
          response(data.data);
        })
        .catch((error) => {
          // if (error.message === 'Network Error') return logout()
          if (error.response?.statusText) {
            const json = JSON.parse(error.response.statusText);
            if (json.code === 400124) {
              logout()
            }
            setSnackBar({
              message: t(json.code),
              isOpen: true,
              severity: "error"
            })
          }
          reject(error);
        })
    });
  }

  return {
    getDeviceList: ({ ...rest }) => promise_(instance.get('/db/device/list', { params: { sign, timestamp, ...rest } })),
    getStaffList: ({ ...rest }) => promise_(instance.get('/db/staff/list', { params: { sign, timestamp, ...rest } })),
    getNewCardList: ({ ...rest }) => promise_(instance.get('/db/newcard/list', { params: { sign, timestamp, ...rest } })),
    getEventList: ({ ...rest }) => promise_(instance.get('/db/event/search', { params: { sign, timestamp, ...rest } })),
    getUserList: ({ ...rest }) => promise_(instance.get('/db/account/list', { params: { sign, timestamp, ...rest } })),
    getLogList: ({ ...rest }) => promise_(instance.get('/db/log', { params: { sign, timestamp, ...rest } })),
    getLocationList: ({ ...rest }) => promise_(instance.get('/db/location/list', { params: { sign, timestamp, ...rest } })),
    getCheckinLogList: ({ ...rest }) => promise_(instance.get('/db/reservation/checkin/loglist', { params: { sign, timestamp, ...rest } })),

    // edit device
    editACCDevice: ({ data, ...rest }) => promise_(instance.post('/db/acc/edit', { ...data }, { params: { sign, timestamp, ...rest } })),
    editPMSDevice: ({ data, ...rest }) => promise_(instance.post('/db/pms/edit', { ...data }, { params: { sign, timestamp, ...rest } })),
    editVMSDevice: ({ data, ...rest }) => promise_(instance.post('/db/vms/edit', { ...data }, { params: { sign, timestamp, ...rest } })),
    editFRSDevice: ({ data, ...rest }) => promise_(instance.post('/db/frs/edit', { ...data }, { params: { sign, timestamp, ...rest } })),
    editACRDevice: ({ data, ...rest }) => promise_(instance.post('/db/acr/edit', { ...data }, { params: { sign, timestamp, ...rest } })),
    editACCRDevice: ({ data, ...rest }) => promise_(instance.post('/db/accr/edit', { ...data }, { params: { sign, timestamp, ...rest } })),
    editFRDDevice: ({ data, ...rest }) => promise_(instance.post('/db/frd/edit', { ...data }, { params: { sign, timestamp, ...rest } })),
    editELEVCDevice: ({ data, ...rest }) => promise_(instance.post('/db/elevc/edit', { ...data }, { params: { sign, timestamp, ...rest } })),
    editELEVFDevice: ({ data, ...rest }) => promise_(instance.post('/db/elevf/edit', { ...data }, { params: { sign, timestamp, ...rest } })),
    editVMSIPCDevice: ({ data, ...rest }) => promise_(instance.post('/db/vmsipc/edit', { ...data }, { params: { sign, timestamp, ...rest } })),
    editPMSGDevice: ({ data, ...rest }) => promise_(instance.post('/db/pmsg/edit', { ...data }, { params: { sign, timestamp, ...rest } })),

    // get child device list
    getACCACCRList: ({ data, ...rest }) => promise_(instance.post('/device/accaccrlist', { ...data }, { params: { sign, timestamp, ...rest } })),
    getVMSVMSIPCList: ({ data, ...rest }) => promise_(instance.post('/device/vmsipclist', { ...data }, { params: { sign, timestamp, ...rest } })),
    getFRSFRDList: ({ data, ...rest }) => promise_(instance.post('/device/frsfrdlist', { ...data }, { params: { sign, timestamp, ...rest } })),
    getPMSPMSGList: ({ data, ...rest }) => promise_(instance.post('/device/pmspmsglist', { ...data }, { params: { sign, timestamp, ...rest } })),


    deleteACCACCR: ({ ...rest }) => promise_(instance.delete('/db/accr/delete', { params: { sign, timestamp, ...rest } })),
    deleteVMSVMSIPC: ({ ...rest }) => promise_(instance.delete('/db/vmsipc/delete', { params: { sign, timestamp, ...rest } })),
    deleteFRSFRD: ({ ...rest }) => promise_(instance.delete('/db/frd/delete', { params: { sign, timestamp, ...rest } })),

    // add child device
    addACCACCR: ({ data, ...rest }) => promise_(instance.post('/db/accr/add', { ...data }, { params: { sign, timestamp, ...rest } })),
    addVMSIPC: ({ data, ...rest }) => promise_(instance.post('/db/vmsipc/add', { ...data }, { params: { sign, timestamp, ...rest } })),

    putDeviceSchedule: ({ data, ...rest }) => promise_(instance.put('/db/device/update_schedule', { ...data }, { params: { sign, timestamp, ...rest } })),
    putDeviceOpenDoor: ({ data, ...rest }) => promise_(instance.put('/db/device/opendoor', { ...data }, { params: { sign, timestamp, ...rest } })),
    getDeviceCardStatusList: ({ data, ...rest }) => promise_(instance.post('/db/device/card_status', { ...data }, { params: { sign, timestamp, ...rest } })),
    postResetDeviceCardStatus: ({ data, ...rest }) => promise_(instance.post('/db/device/reset_card_status', { ...data }, { params: { sign, timestamp, ...rest } })),
    getAvailableDeviceIdList: ({ ...rest }) => promise_(instance.get('/db/deviceid/list', { params: { sign, timestamp, ...rest } })),
    getDevcieGroupList: ({ ...rest }) => promise_(instance.get('/db/group/list', { params: { sign, timestamp, ...rest } })),
    getAccessGroupListById: ({ ...rest }) => promise_(instance.get('/db/deviceid/list', { params: { sign, timestamp, ...rest } })),
    getStaffGroupList: ({ ...rest }) => promise_(instance.get('/db/staffgroup/list', { params: { sign, timestamp, ...rest } })),
    addAccess: ({ data, ...rest }) => promise_(instance.post('/db/access/add', data, { params: { sign, timestamp, ...rest } })),
    getStaff: ({ ...rest }) => promise_(instance.get('/db/staff/get', { params: { sign, timestamp, ...rest } })),
    editStaff: ({ data, ...rest }) => promise_(instance.post('/db/staff/edit', data, { params: { sign, timestamp, ...rest } })),
    getAccountById: ({ ...rest }) => promise_(instance.get('/db/account/get', { params: { sign, timestamp, ...rest } })),
    editAccountCustomizeById: ({ data, ...rest }) => promise_(instance.post('/db/account/customize/edit', data, { params: { sign, timestamp, ...rest } })),
    getDeviceById: ({ ...rest }) => promise_(instance.get('/db/device/get', { params: { sign, timestamp, ...rest } }))
  }
}

const Promise_ = (instance_) => {
  return new Promise((response, reject) => {
    instance_
      .then((data) => {
        response(data.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//auth
export const getKey = async ({ timestamp }) => Promise_(instance.get('/system', {
  params: {
    action: 'getKey',
    timestamp
  }
}))
export const tokenlogin = ({ timestamp, credentials }) => Promise_(instance.get('/system', {
  params: {
    action: 'tokenlogin',
    timestamp,
    credentials
  }
}))
