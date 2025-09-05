import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react';
import { cilWarning, cilWallet, cilFolderOpen, cilCalculator, cilSpeedometer, cilDescription, cilSettings, cilPeople, cilShieldAlt, cilBriefcase } from '@coreui/icons';

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
    name: 'Bank Transactions',
    to: '/bank-transactions',
    icon: cilCalculator,
  },
  {
    component: CNavItem,
    name: 'Contracts',
    to: '/contracts',
    icon: cilDescription,
  },
  {
    component: CNavItem,
    name: 'KIF',
    to: '/kif',
    icon: cilWallet,
  },
  {
    component: CNavItem,
    name: 'KUF',
    to: '/kuf',
    icon: cilFolderOpen,
  },
  {
    component: CNavItem,
    name: 'Partners',
    to: '/partners',
    icon: cilBriefcase,
  },
  {
    component: CNavTitle,
    name: 'Issues',
  },
  {
    component: CNavItem,
    name: 'Invalid PDFs',
    to: '/invalid-pdfs',
    icon: cilWarning,
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
        icon: cilPeople,
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
