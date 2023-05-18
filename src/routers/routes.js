import Event from '../Views/Event'
import Devices from '../Views/Devices'
import Home from '../Views/Home'
import People from '../Views/People'
import Person from '../Views/Person'
import User from '../Views/User'
import Card from '../Views/Card'
import Log from '../Views/Log'
import Location from '../Views/Location'
import Visitor from '../Views/Visitor'
import Access from '../Views/Access'

import Device from '../Views/Device'

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
    path: '/home',
    component: Home,
    icon: DashboardIcon,
    siderlink: true
  },
  {
    path: '/devices',
    component: Devices,
    icon: DevicesOtherIcon,
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
    path: '/people',
    component: People,
    icon: PeopleIcon,
    siderlink: true
  },
  {
    path: '/person/:staffid',
    component: Person,
    siderlink: false
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
    path: '/device/:deviceid',
    component: Device,
    siderlink: false
  },
  {
    path: '/access',
    component: Access,
    icon: SubtitlesIcon,
    siderlink: true
  }
]

export default routes