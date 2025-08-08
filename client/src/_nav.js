import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react';
import { cilHome, cilListNumbered, cilList, cilCalculator, cilSpeedometer } from '@coreui/icons';

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
        to: '/admin/user-dashboard',
      },
      {
        component: CNavItem,
        name: 'Roles/Status',
        to: '/admin/role-status-dashboard',
      },
    ],
  },
];

export default _nav;
