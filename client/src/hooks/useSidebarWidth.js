import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

export const useSidebarWidth = () => {
    const sidebarShow = useSelector((state) => state.ui.sidebarShow);
    const sidebarUnfoldable = useSelector((state) => state.ui.sidebarUnfoldable);
    const [sidebarWidth, setSidebarWidth] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Memoize the calculation function
    const calculateWidth = useCallback(() => {
        let width = 0;

        if (sidebarShow) {
            if (sidebarUnfoldable) {
                // If in collapsed/icon mode - use 56px base, 240px on hover
                width = isHovered ? 240 : 56;
            } else {
                // If in normal expanded mode
                width = 240;
            }
        }

        return width;
    }, [sidebarShow, sidebarUnfoldable, isHovered]);

    useEffect(() => {
        const newWidth = calculateWidth();
        setSidebarWidth(newWidth);
    }, [calculateWidth]);

    useEffect(() => {
        // Listen for sidebar hover events with improved event handling
        const sidebar = document.querySelector('.sidebar-unfoldable, .sidebar.sidebar-unfoldable');

        if (sidebar && sidebarUnfoldable && sidebarShow) {
            const handleMouseEnter = () => {
                setIsHovered(true);
            };
            const handleMouseLeave = () => {
                setIsHovered(false);
            };

            sidebar.addEventListener('mouseenter', handleMouseEnter);
            sidebar.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                sidebar.removeEventListener('mouseenter', handleMouseEnter);
                sidebar.removeEventListener('mouseleave', handleMouseLeave);
            };
        } else {
            // Reset hover state when sidebar is not unfoldable or not shown
            setIsHovered(false);
        }
    }, [sidebarUnfoldable, sidebarShow]);

    // Reset hover state when sidebar is hidden or changes mode
    useEffect(() => {
        if (!sidebarShow || !sidebarUnfoldable) {
            setIsHovered(false);
        }
    }, [sidebarShow, sidebarUnfoldable]);

    return sidebarWidth;
};
