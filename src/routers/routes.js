import Event from '../Views/Event'
import Devices from '../Views/Device/List'
import Home from '../Views/Home'
import Staffs from '../Views/Staff/List'
import Staff from '../Views/Staff/Staff'
import User from '../Views/User'
import Card from '../Views/Card'
import Log from '../Views/Log'
import Location from '../Views/Location'
import Visitor from '../Views/Visitor'
import Access from '../Views/Access'

import Device from '../Views/Device/Device'

import DashboardIcon from '@material-ui/icons/Dashboard';
import DevicesOtherIcon from '@material-ui/icons/DevicesOther';
import EventIcon from '@material-ui/icons/Event';
import PeopleIcon from '@material-ui/icons/People';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import StorageIcon from '@material-ui/icons/Storage';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
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
    path: '/device/device/:deviceid',
    component: Device,
    siderlink: false
  },
  {
    path: '/device/list',
    component: Devices,
    icon: DevicesOtherIcon,
    exact: true,
    siderlink: true
  },
  {
    path: '/event',
    component: Event,
    icon: EventIcon,
    siderlink: true
  },
  {
    path: '/log',
    component: Log,
    icon: StorageIcon,
    siderlink: true
  },
  {
    path: '/user',
    component: User,
    icon: AccountBoxIcon,
    siderlink: true
  },
  {
    path: '/staff//staff/:staffid',
    component: Staff,
    siderlink: false
  },
  {
    path: '/staff/list',
    component: Staffs,
    icon: PeopleIcon,
    exact: true,
    siderlink: true
  },
  {
    path: '/location',
    component: Location,
    icon: LocationOnIcon,
    siderlink: true
  },
  {
    path: '/card',
    component: Card,
    icon: CreditCardIcon,
    siderlink: true
  },
  {
    path: '/visitor',
    component: Visitor,
    icon: DirectionsWalkIcon,
    siderlink: true
  },
  {
    path: '/access',
    component: Access,
    icon: SubtitlesIcon,
    siderlink: true
  }
]

export default routes