import { useSelector } from 'react-redux';
import navigation from '../_nav';

export function useFilteredNavigation(isHovered) {
    const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable);
    const userRole = useSelector((state) => state.user.profile.roleName);

    return navigation
        .map((item) => {
            const isAdmin = userRole === 'admin';
            if (item.adminOnly && !isAdmin) return null;

            if (item.component?.displayName === 'CNavGroup') {
                const filteredItems = (item.items || []).filter(
                    (child) => !child.adminOnly || isAdmin
                );
                if (unfoldable && !isHovered) {
                    return { ...item, items: [] };
                }
                return filteredItems.length ? { ...item, items: filteredItems } : null;
            }

            return item;
        })
        .filter(Boolean);
}