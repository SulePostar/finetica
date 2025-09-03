import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CSidebar,
  CSidebarFooter,
  CSidebarToggler,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

import navigation from '../../_nav'
import { AppSidebarNav } from './AppSidebarNav'
import './AppSidebar.css'
import { colors } from '../../styles/colors'
import { setDriveConnected } from '../../redux/sidebar/sidebarSlice'

const AppSidebar = ({ isDarkMode }) => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)
  const userRole = useSelector((state) => state.user.profile.roleName)
  const driveConnected = useSelector((state) => state.sidebar.driveConnected)

  const [isHovered, setIsHovered] = useState(false)

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

  // Filter navigation based on role + collapse state
  const filteredNav = navigation
    .map((item) => {
      const isAdmin = userRole === 'admin'
      if (item.adminOnly && !isAdmin) return null

      if (item.component?.displayName === 'CNavGroup') {
        const filteredItems = (item.items || []).filter(
          (child) => !child.adminOnly || isAdmin
        )
        if (unfoldable && !isHovered) {
          return { ...item, items: [] }
        }
        return filteredItems.length ? { ...item, items: filteredItems } : null
      }

      return item
    })
    .filter(Boolean)

  return (
    <CSidebar
      className={`sidebar ${sidebarShow ? 'show' : ''} ${unfoldable ? 'sidebar-unfoldable' : ''
        }`}
      // colorScheme is handled by CoreUI theme, no need for manual prop
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      style={{
        zIndex: unfoldable && isHovered ? 1060 : 1050,
        borderRight: '1px solid var(--cui-sidebar-border-color, #efefefef)',
        backgroundColor: 'var(--cui-sidebar-bg)',
        color: 'var(--cui-sidebar-color)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <img
          src={'/symphonypurple.png'}
          alt="Logo"
        />
      </div>

      {/* Navigation */}
      <AppSidebarNav items={filteredNav} />

      {/* Google Drive status */}
      {unfoldable && !isHovered ? (
        <div className="d-none d-lg-flex justify-content-center align-items-center p-3">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              backgroundColor: driveConnected
                ? colors.success.background
                : colors.error.background,
            }}
          >
            <CIcon
              icon={cilCloudDownload}
              style={{
                color: driveConnected
                  ? colors.success.text
                  : colors.error.text,
                fontSize: 16,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="d-none d-lg-flex justify-content-between align-items-center px-3 py-2">
          <div
            className="fw-semibold small"
            style={{ color: 'var(--cui-sidebar-color, #212529)' }}
          >
            Google Drive
          </div>
          <CBadge
            size="sm"
            style={{
              backgroundColor: driveConnected
                ? colors.success.background
                : 'var(--cui-sidebar-bg, #ede9fe)',
              color: driveConnected
                ? colors.success.text
                : 'var(--cui-sidebar-color, #212529)',
            }}
          >
            {driveConnected ? 'Connected' : 'Disconnected'}
          </CBadge>
        </div>
      )}

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
