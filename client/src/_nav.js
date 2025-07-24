import { CNavItem, CNavTitle } from '@coreui/react';

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
];

export default _nav;
