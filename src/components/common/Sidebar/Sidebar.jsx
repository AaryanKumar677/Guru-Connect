/* ==============================
   Sidebar Component - Dashboard Navigation
   Collapsible sidebar with role-based navigation links
   (student/tutor), user avatar, settings link, and mobile responsive overlay
   ============================== */
import { useLocation, NavLink } from 'react-router-dom'
import { useAuth, useTheme, useSidebar } from '../../../App'
import './Sidebar.css'

const Sidebar = ({ role }) => {
    const location = useLocation()
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const { sidebarCollapsed: isCollapsed, toggleSidebar, mobileMenuOpen, closeMobileMenu } = useSidebar()

    const studentLinks = [
        {
            path: '/student/dashboard',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" />
                </svg>
            ),
            label: 'Dashboard'
        },
        {
            path: '/student/ai-assistant',
            icon: <img src="/assets/icons/guru-ai.png" alt="GuruAI" width="24" height="24" />,
            label: 'GuruAI'
        },
        {
            path: '/student/tutors',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H10V22H14V20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18Z" />
                    <path d="M12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z" />
                    <path d="M12 17C9.33 17 7 18.34 7 20V19H17V20C17 18.34 14.67 17 12 17Z" />
                </svg>
            ),
            label: 'Find Tutors'
        },
        {
            path: '/student/doubts',
            icon: <img src="/assets/icons/my-doubts.png" alt="My Doubts" width="24" height="24" />,
            label: 'My Doubts'
        },
        { path: '/student/subscription', icon: '💎', label: 'Subscription' },
        { path: '/student/messages', icon: '💬', label: 'Messages' },
        { path: '/student/help', icon: '❓', label: 'Help & FAQ' },
    ]

    const tutorLinks = [
        {
            path: '/tutor/dashboard',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" />
                </svg>
            ),
            label: 'Dashboard'
        },
        { path: '/tutor/sessions', icon: '📅', label: 'Sessions' },
        { path: '/tutor/messages', icon: '💬', label: 'Messages' },
        { path: '/tutor/earnings', icon: <img src="/assets/icons/total-earnings.png" alt="Earnings" width="24" height="24" />, label: 'Earnings' },
        { path: '/tutor/help', icon: '❓', label: 'Help & FAQ' },
    ]

    const links = role === 'tutor' ? tutorLinks : studentLinks

    const settingsPath = role === 'tutor' ? '/tutor/settings' : '/student/settings'

    const handleNavigation = (path) => {
        navigate(path)
        closeMobileMenu()
    }

    return (
        <>
            {mobileMenuOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={closeMobileMenu}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 90
                    }}
                />
            )}

            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'open' : ''}`}>
                <button
                    className="sidebar-toggle"
                    onClick={toggleSidebar}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isCollapsed ? (
                            <path d="M9 18l6-6-6-6" />
                        ) : (
                            <path d="M15 18l-6-6 6-6" />
                        )}
                    </svg>
                </button>

                <div className="sidebar-user">
                    <div className="user-avatar-large">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user?.name || 'User'}
                                className="avatar-image"
                            />
                        ) : (
                            user?.name?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="user-info">
                            <span className="user-name">{user?.name || user?.fullName || 'User'}</span>
                            <span className="user-role">
                                <img
                                    src={role === 'tutor' ? "/assets/icons/tutor-role.png" : "/assets/icons/role.png"}
                                    alt="Role"
                                    width="14"
                                    height="14"
                                    style={{ marginRight: '4px', verticalAlign: 'middle', display: 'inline-block' }}
                                />
                                {role === 'tutor' ? 'Tutor' : 'Student'}
                            </span>
                        </div>
                    )}
                </div>

                <nav className="sidebar-nav">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={closeMobileMenu}
                            title={isCollapsed ? link.label : undefined}
                            end={link.path.endsWith('dashboard')}
                        >
                            <span className="nav-icon">{link.icon}</span>
                            {!isCollapsed && <span className="nav-label">{link.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <NavLink
                        to={settingsPath}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={closeMobileMenu}
                        title={isCollapsed ? 'Settings' : undefined}
                    >
                        <span className="nav-icon"><img src="/assets/icons/settings.png" alt="Settings" width="24" height="24" /></span>
                        {!isCollapsed && <span className="nav-label">Settings</span>}
                    </NavLink>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
