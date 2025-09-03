import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react';
import { cilHome, cilFile, cilBank, cilSettings, cilUser, cilShieldAlt, cilTag } from '@coreui/icons';

const _nav = [
  {
    component: CNavItem,
    name: 'Finetica',
    to: '/',
    icon: cilHome,
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavItem,
    name: 'Contracts',
    to: '/contracts',
    icon: cilFile,
  },
  {
    component: CNavItem,
    name: 'KIF',
    to: '/kif',
    icon: cilTag,
  },
  {
    component: CNavItem,
    name: 'KUF',
    to: '/kuf',
    icon: cilTag,
  },
  {
    component: CNavItem,
    name: 'Bank Transactions',
    to: '/bank-transactions',
    icon: cilBank,
  },
  {
    component: CNavTitle,
    name: 'Dashboard',
    adminOnly: true,
  },
  {
    component: CNavGroup,
    name: 'Management',
    icon: cilSettings,
    adminOnly: true,
    items: [
      {
        component: CNavItem,
        name: 'Users',
        to: '/admin/users',
        icon: cilUser,
      },
      {
        component: CNavItem,
        name: 'Roles/Status',
        to: '/admin/role-status',
        icon: cilShieldAlt,
      },
    ],
  },
];

export default _nav;
