import { CBadge } from '@coreui/react'
import './AppSidebar.css'

const DriveStatusBadge = ({ driveConnected, isDarkMode }) => {
    let badgeClass = 'drive-badge '

    if (driveConnected) {
        badgeClass += 'connected'
    } else {
        badgeClass += isDarkMode ? 'disconnected-dark' : 'disconnected-light'
    }

    return (
        <CBadge size="sm" className={badgeClass}>
            {driveConnected ? 'Connected' : 'Disconnected'}
        </CBadge>
    )
}

export default DriveStatusBadge
