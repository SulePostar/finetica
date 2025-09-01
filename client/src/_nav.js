import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react';
import { cilHome, cilListNumbered, cilList, cilCalculator, cilSpeedometer, cilChart, cilDescription, cilSettings, cilPeople, cilShieldAlt, cilBriefcase } from '@coreui/icons';

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
    name: 'Contracts',
    to: '/contracts',
    icon: cilDescription,
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
    name: 'Bank Transactions',
    to: '/bank-transactions',
    icon: cilCalculator,
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
        icon: cilPeople,
      },
      {
        component: CNavItem,
        name: 'Roles/Status',
        to: '/admin/role-status',
        icon: cilShieldAlt,
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
