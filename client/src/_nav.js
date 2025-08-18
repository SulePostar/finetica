import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react';
import { cilHome, cilListNumbered, cilList, cilCalculator, cilSpeedometer, cilChart } from '@coreui/icons';

const _nav = [
  {
    component: CNavItem,
    name: 'FINETICA',
    to: '/',
    icon: cilSpeedometer,
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavItem,
    name: 'KIF',
    to: '/kif',
    icon: cilListNumbered,
  },
  {
    component: CNavItem,
    name: 'KUF',
    to: '/kuf',
    icon: cilList,
  },
  {
    component: CNavItem,
    name: 'VAT',
    to: '/vat',
    icon: cilCalculator,
  },
  {
    component: CNavTitle,
    name: 'Dashboard',
    adminOnly: true,
  },
  {
    component: CNavGroup,
    name: 'Management',
    adminOnly: true,
    items: [
      {
        component: CNavItem,
        name: 'Users',
        to: '/management/users',
      },
      {
        component: CNavItem,
        name: 'Roles/Status',
        to: '/management/roles-status',
      },
      {
        component: CNavItem,
        name: 'Activity Logs',
        to: '/admin/activity-logs',
        icon: cilChart,
      },
    ],
  },
];

export default _nav;
