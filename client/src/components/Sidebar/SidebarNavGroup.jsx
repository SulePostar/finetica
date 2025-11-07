import SidebarNavItem from './SidebarNavItem';
import SidebarNavLinkContent from './SidebarNavLinkContent';

const SidebarNavGroup = ({ item, idx, onItemClick }) => {
    const { component: Component, name, icon, items, adminOnly, ...rest } = item;

    return (
        <Component
            compact
            as="div"
            idx={idx}
            toggler={<SidebarNavLinkContent name={name} icon={icon} />}
            {...rest}
        >
            {items?.map((subItem, subIndex) =>
                subItem.items ? (
                    <SidebarNavGroup
                        key={subIndex}
                        item={subItem}
                        idx={`${idx}-${subIndex}`}
                        onItemClick={onItemClick}
                    />
                ) : (
                    <SidebarNavItem
                        key={subIndex}
                        item={subItem}
                        indent={true}
                        onItemClick={onItemClick}
                    />
                )
            )}
        </Component>
    );
};

export default SidebarNavGroup;
