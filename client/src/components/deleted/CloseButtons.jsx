import React from 'react'

const CloseButtons = () => {
    return (
        <>
            <CCloseButton
                className="d-lg-none"
                dark={isDarkMode}
                onClick={() => dispatch({ type: 'set', sidebarShow: false })}
            />
            <CSidebarHeader className="border-bottom">
                <CCloseButton
                    className="d-lg-none"
                    dark={isDarkMode}
                    onClick={() => dispatch({ type: 'set', sidebarShow: false })}
                />
            </CSidebarHeader>
        </>
    )
}

export default CloseButtons
