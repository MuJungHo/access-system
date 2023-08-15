import Event from '../Views/Event'
import DeviceManagement from '../Views/Device/Management'
import Home from '../Views/Home'
import StaffManagement from '../Views/Staff/Management'
import Staff from '../Views/Staff/Staff'
import User from '../Views/User'
import Log from '../Views/Log'
import Access from '../Views/Access'
import Setting from '../Views/Setting'

import Device from '../Views/Device/Item'
import CardStatus from '../Views/Device/CardStatus'

import Location from '../Views/Location/Management'
import AreaList from "../Views/Location/AreaList"
import Area from "../Views/Location/Area"
import AreaStatus from "../Views/Location/AreaStatus"

import DashboardIcon from '@material-ui/icons/Dashboard';
import DevicesOtherIcon from '@material-ui/icons/DevicesOther';
import EventIcon from '@material-ui/icons/Event';
import PeopleIcon from '@material-ui/icons/People';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import StorageIcon from '@material-ui/icons/Storage';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import SettingsIcon from '@material-ui/icons/Settings';

const routes = [
  {
    path: '/',
    component: Home,
    icon: DashboardIcon,
    siderlink: true,
    exact: true,
  },
  {
    path: '/device/item/:deviceid',
    component: Device,
    siderlink: false
  },
  {
    path: '/device/child/:parentid/:deviceid',
    component: Device,
    siderlink: false
  },
  {
    path: '/device/card-status/:deviceid',
    component: CardStatus,
    siderlink: false
  },
  {
    path: '/device/management',
    component: DeviceManagement,
    icon: DevicesOtherIcon,
    exact: true,
    siderlink: true
  },
  {
    path: '/staff/person/:staffid',
    component: Staff,
    siderlink: false
  },
  {
    path: '/staff/management',
    component: StaffManagement,
    icon: PeopleIcon,
    exact: true,
    siderlink: true
  },
  {
    path: '/access',
    component: Access,
    icon: SubtitlesIcon,
    siderlink: true
  },
  {
    path: '/event',
    component: Event,
    icon: EventIcon,
    siderlink: true
  },
  {
    path: '/location/management',
    component: Location,
    icon: LocationCityIcon,
    siderlink: true
  },
  {
    path: '/location/:locationid/area-list',
    component: AreaList,
    siderlink: false
  },
  {
    path: '/location/:locationid/area/:areaid',
    component: Area,
    siderlink: false
  },
  {
    path: '/location/:locationid/area-status/:areaid',
    component: AreaStatus,
    siderlink: false
  },
  {
    path: '/user',
    component: User,
    icon: AccountBoxIcon,
    siderlink: true
  },
  {
    path: '/log',
    component: Log,
    icon: StorageIcon,
    siderlink: true
  },
  {
    path: '/setting',
    component: Setting,
    icon: SettingsIcon,
    siderlink: true
  },
]

export default routes