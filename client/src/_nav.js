import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react';

const _nav = [
  {
    component: CNavItem,
    name: 'FINETICA',
    to: '/',
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavItem,
    name: 'KIF',
    to: '/kif',
  },
  {
    component: CNavItem,
    name: 'KUF',
    to: '/kuf',
  },
  {
    component: CNavItem,
    name: 'VAT',
    to: '/vat',
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
    ],
  },
];

export default _nav;
