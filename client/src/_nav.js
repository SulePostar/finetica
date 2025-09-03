import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react';
<<<<<<< HEAD
import { cilHome, cilFile, cilBank, cilSettings, cilUser, cilShieldAlt, cilTag } from '@coreui/icons';
=======
import { cilHome, cilListNumbered, cilList, cilCalculator, cilSpeedometer, cilDescription, cilSettings, cilPeople, cilShieldAlt, cilBriefcase } from '@coreui/icons';
>>>>>>> 8ec2384b08b4b32e4e3ae0ac747f3a9f1876c714

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
