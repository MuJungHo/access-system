import Event from '../Views/Event'
import DeviceManagement from '../Views/Device/Management'
import Home from '../Views/Home'
import StaffManagement from '../Views/Staff/Management'
import Staff from '../Views/Staff/Staff'
import User from '../Views/User'
import Log from '../Views/Log'
import Location from '../Views/Location'
import Access from '../Views/Access'

import Device from '../Views/Device/Item'
import CardStatus from '../Views/Device/CardStatus'

import DashboardIcon from '@material-ui/icons/Dashboard';
import DevicesOtherIcon from '@material-ui/icons/DevicesOther';
import EventIcon from '@material-ui/icons/Event';
import PeopleIcon from '@material-ui/icons/People';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import StorageIcon from '@material-ui/icons/Storage';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import SubtitlesIcon from '@material-ui/icons/Subtitles';

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
    path: '/location',
    component: Location,
    icon: LocationOnIcon,
    siderlink: true
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
]

export default routes