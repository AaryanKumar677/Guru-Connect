/* ==============================
   Notifications Component - Bell Dropdown
   Header notification bell with unread count badge, dropdown list
   of notifications (sessions, doubts, points, tutors), mark as read, and clear all
   ============================== */
import { useState, useRef, useEffect } from 'react'
import './Notifications.css'

const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'session',
            title: 'Session Reminder',
            message: 'Your Math session starts in 30 minutes',
            time: '5 min ago',
            read: false,
            icon: '📅'
        },
        {
            id: 2,
            type: 'doubt',
            title: 'Doubt Solved',
            message: 'Your Physics doubt has been answered by AI',
            time: '1 hour ago',
            read: false,
            icon: '✅'
        },
        {
            id: 3,
            type: 'points',
            title: 'Points Earned!',
            message: 'You earned 50 points for completing a session',
            time: '2 hours ago',
            read: true,
            icon: '⭐'
        },
        {
            id: 4,
            type: 'tutor',
            title: 'New Tutor Available',
            message: 'Prof. Sharma is now available for Chemistry',
            time: '1 day ago',
            read: true,
            icon: '👨‍🏫'
        }
    ])

    const dropdownRef = useRef(null)
    const unreadCount = notifications.filter(n => !n.read).length

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    const clearAll = () => {
        setNotifications([])
        setIsOpen(false)
    }

    return (
        <div className="notifications-wrapper" ref={dropdownRef}>
            <button
                className="notifications-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notifications-dropdown">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button className="mark-all-btn" onClick={markAllAsRead}>
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notifications-list">
                        {notifications.length === 0 ? (
                            <div className="notifications-empty">
                                <span>🔔</span>
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <span className="notification-icon">{notification.icon}</span>
                                    <div className="notification-content">
                                        <span className="notification-title">{notification.title}</span>
                                        <span className="notification-message">{notification.message}</span>
                                        <span className="notification-time">{notification.time}</span>
                                    </div>
                                    {!notification.read && <span className="unread-dot"></span>}
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="notifications-footer">
                            <button className="clear-btn" onClick={clearAll}>
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Notifications
