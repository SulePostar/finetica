import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CSidebar,
  CSidebarFooter,
  CSidebarToggler,
} from '@coreui/react'

import { useFilteredNavigation } from '../../hooks/useFilteredNavigation'
import { AppSidebarNav } from './AppSidebarNav'
import SidebarDriveStatus from './SidebarDriveStatus'
import './AppSidebar.css'
import { setDriveConnected } from '../../redux/sidebar/sidebarSlice'

const AppSidebar = ({ isDarkMode }) => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)
  const userRole = useSelector((state) => state.user.profile.roleName)
  const driveConnected = useSelector((state) => state.sidebar.driveConnected)

  const [isHovered, setIsHovered] = useState(false)

  const handleCloseSidebar = () => {
    if (window.innerWidth < 768) {
      dispatch({ type: 'set', sidebarShow: false })
    }
  }

  // Check Google Drive connection
  useEffect(() => {
    const checkDriveConnection = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '')
        const res = await fetch(`${baseUrl}/drive/drive-connection`, {
          credentials: 'include',
        })
        const data = await res.json()
        dispatch(setDriveConnected(data.connected))
      } catch {
        dispatch(setDriveConnected(false))
      }
    }

    checkDriveConnection()
    const interval = setInterval(checkDriveConnection, 30000)
    return () => clearInterval(interval)
  }, [dispatch])

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarShow && window.innerWidth <= 768) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }
  }, [sidebarShow])

  // Use custom hook for filtered navigation
  const filteredNav = useFilteredNavigation(isHovered)

  return (
    <CSidebar
      className={`sidebar ${sidebarShow ? 'show' : ''} ${unfoldable ? 'sidebar-unfoldable' : ''
        }`}
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      style={{
        zIndex: unfoldable && isHovered ? 1060 : 1050,
        borderRight: '2px solid var(--cui-sidebar-border-color, #efefefef)',
        boxShadow: unfoldable && isHovered ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
        backgroundColor: 'var(--cui-sidebar-bg)',
        color: 'var(--cui-sidebar-color)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={'/symphonypurple.png'} alt="Logo" />
      </div>

      {/* Navigation */}
      <AppSidebarNav items={filteredNav} onItemClick={handleCloseSidebar} />

      {/* Google Drive status */}
      <SidebarDriveStatus unfoldable={unfoldable} isHovered={isHovered} driveConnected={driveConnected} />

      {/* Footer */}
      <CSidebarFooter className="d-none d-lg-flex justify-content-center align-items-center p-3">
        <CSidebarToggler
          onClick={() =>
            dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
          }
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
