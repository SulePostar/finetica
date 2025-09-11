import React from 'react';
import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { CSidebarNav } from '@coreui/react';
import SidebarNavItem from './SidebarNavItem';
import SidebarNavGroup from './SidebarNavGroup';

export const AppSidebarNav = ({ items, onItemClick }) => (
  <CSidebarNav as={SimpleBar}>
    {items?.map((item, index) =>
      item.items ? (
        <SidebarNavGroup key={index} item={item} onItemClick={onItemClick} />
      ) : (
        <SidebarNavItem key={index} item={item} onItemClick={onItemClick} />
      )
    )}
  </CSidebarNav>
);

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};
