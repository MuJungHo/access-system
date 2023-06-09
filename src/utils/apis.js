import axios from 'axios'
const md5 = require("md5");

export const instance = axios.create({
  baseURL: `http://${process.env.REACT_APP_DOMAIN}/cgi-bin`,
  timeout: 10000
})

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

export const api = (token, logout) => {
  const timestamp = Date.now()
  const sign = md5(timestamp + '#' + token)

  const promise_ = (instance_) => {
    return new Promise((response, reject) => {
      instance_
        .then((data) => {
          response(data.data);
        })
        .catch((error) => {
          if (error.message === 'Network Error') return logout()
          if (error.response.statusText) {
            const json = JSON.parse(error.response.statusText);
            if (json.code === 400124) {
              logout()
            }
          }
          reject(error);
        })
    });
  }

  const getDeviceList = async ({ ...rest }) => {
    return promise_(instance.get('/db/device/list', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const getNewCardList = async ({ ...rest }) => {
    return promise_(instance.get('/db/newcard/list', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const getEventList = async ({ ...rest }) => {
    return promise_(instance.get('/db/event/search', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const getUserList = async ({ ...rest }) => {
    return promise_(instance.get('/db/account/list', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const getLogList = async ({ ...rest }) => {
    return promise_(instance.get('/db/log', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const getLocationList = async ({ ...rest }) => {
    return promise_(instance.get('/db/location/list', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const getCheckinLogList = async ({ ...rest }) => {
    return promise_(instance.get('/db/reservation/checkin/loglist', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const editVMSDevice = async ({ data, ...rest }) => {
    return promise_(instance.post('/db/vms/edit', {
      ...data
    }, {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const getDevcieGroupList = async ({ ...rest }) => {
    return promise_(instance.get('/db/group/list', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const getAccessGroupListById = async ({ ...rest }) => {
    return promise_(instance.get('/db/access/group/list', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const getStaffGroupList = async ({ ...rest }) => {
    return promise_(instance.get('/db/staffgroup/list', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const getStaffList = async ({ ...rest }) => {
    return promise_(instance.get('/db/staff/list', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const getStaff = async ({ ...rest }) => {
    return promise_(instance.get('/db/staff/get', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }
  
  const editStaff = async ({ data, ...rest }) => {
    return promise_(instance.post('/db/staff/edit', data, {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const addAccess = async ({ data, ...rest }) => {
    return promise_(instance.post('/db/access/add', data, {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const getAccountById = async ({ ...rest }) => {
    return promise_(instance.get('/db/account/get', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const editAccountCustomizeById = async ({ data, ...rest }) => {
    return promise_(instance.post('/db/account/customize/edit', data, {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  const getDeviceById = async ({ ...rest }) => {
    return promise_(instance.get('/db/device/get', {
      params: {
        sign,
        timestamp,
        ...rest
      }
    }))
  }

  return {
    getDeviceList,
    getStaffList,
    getNewCardList,
    getEventList,
    getUserList,
    getLogList,
    getLocationList,
    getCheckinLogList,
    editVMSDevice,
    getDevcieGroupList,
    getAccessGroupListById,
    getStaffGroupList,
    addAccess,
    getStaff,
    editStaff,
    getAccountById,
    editAccountCustomizeById,
    getDeviceById
  }
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
