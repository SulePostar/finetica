import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react';
import { cilHome, cilFile, cilBank, cilSettings, cilUser, cilShieldAlt, cilTag, cilBriefcase, cilWarning } from '@coreui/icons';


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
