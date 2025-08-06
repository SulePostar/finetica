import { CNavItem, CNavTitle } from '@coreui/react';
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
];

export default _nav;
