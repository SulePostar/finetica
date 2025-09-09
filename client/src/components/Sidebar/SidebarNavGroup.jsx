import React from 'react';
import SidebarNavItem from './SidebarNavItem';
import SidebarNavLinkContent from './SidebarNavLinkContent';

const SidebarNavGroup = ({ item }) => {
    const { component: Component, name, icon, items, ...rest } = item;

    return (
        <Component
            compact
            as="div"
            toggler={<SidebarNavLinkContent name={name} icon={icon} />}
            {...rest}
        >
            {items?.map((subItem, subIndex) =>
                subItem.items
                    ? <SidebarNavGroup key={subIndex} item={subItem} />
                    : <SidebarNavItem key={subIndex} item={subItem} indent={true} />
            )}
        </Component>
    );
};

export default SidebarNavGroup;
