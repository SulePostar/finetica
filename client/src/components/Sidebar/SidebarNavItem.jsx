import React from 'react';
import { CNavLink } from '@coreui/react';
import { NavLink } from 'react-router-dom';
import SidebarNavLinkContent from './SidebarNavLinkContent';

const SidebarNavItem = ({ item, indent, onItemClick }) => {
    const { component: Component, name, badge, icon, adminOnly, ...rest } = item;

    return (
        <Component>
            {rest.to || rest.href ? (
                <CNavLink
                    {...(rest.to && { as: NavLink })}
                    {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
                    {...rest}
                    onClick={onItemClick}
                >
                    <SidebarNavLinkContent
                        name={name}
                        icon={icon}
                        badge={badge}
                        indent={indent}
                    />
                </CNavLink>
            ) : (
                <SidebarNavLinkContent
                    name={name}
                    icon={icon}
                    badge={badge}
                    indent={indent}
                />
            )}
        </Component>
    );
};

export default SidebarNavItem;
