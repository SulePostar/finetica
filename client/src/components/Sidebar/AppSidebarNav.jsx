import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react';
import CIcon from '@coreui/icons-react';

export const AppSidebarNav = ({ items }) => {
  const renderNavLinkContent = (name, icon, badge, indent = false) => (
    <>
      {icon ? (
        <CIcon icon={icon} className="nav-icon" />
      ) : (
        indent && (
          <CBadge
            color="secondary"
            shape="rounded-pill"
            className="me-2"
          />
        )
      )}
      {name}
      {badge && (
        <CBadge color={badge.color} className="ms-auto" size="sm" shape="rounded-pill">
          {badge.text}
        </CBadge>
      )}
    </>
  );

  const renderNavItem = (item, index, indent = false) => {
    const { component: Component, name, badge, icon, ...rest } = item;

    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
            {...rest}
          >
            {renderNavLinkContent(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          renderNavLinkContent(name, icon, badge, indent)
        )}
      </Component>
    );
  };

  const renderNavGroup = (item, index) => {
    const { component: Component, name, icon, items, ...rest } = item;

    return (
      <Component
        compact
        as="div"
        key={index}
        toggler={renderNavLinkContent(name, icon, null)}
        {...rest}
      >
        {items?.map((subItem, subIndex) =>
          subItem.items
            ? renderNavGroup(subItem, subIndex)
            : renderNavItem(subItem, subIndex, true)
        )}
      </Component>
    );
  };

  return (
    <CSidebarNav as={SimpleBar}>
      {items?.map((item, index) =>
        item.items ? renderNavGroup(item, index) : renderNavItem(item, index)
      )}
    </CSidebarNav>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};
