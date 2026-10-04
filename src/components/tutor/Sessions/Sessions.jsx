/* ==============================
   Sessions Component - Tutor Session Management
   Manage tutoring sessions with tabs (upcoming, completed, cancelled),
   session cards with student info, time, duration, and action buttons
   ============================== */
import { useState } from 'react'
import { useToast } from '../../../App'
import './Sessions.css'

const Sessions = () => {
    const { showToast } = useToast()
    const [filter, setFilter] = useState('upcoming')
    const [selectedDate, setSelectedDate] = useState(new Date())

    const sessions = [
        { id: 1, student: 'Rahul Sharma', subject: 'Mathematics', topic: 'Integration', date: 'Today', time: '4:00 PM', duration: '30 min', status: 'confirmed', earnings: 10 },
        { id: 2, student: 'Priya Patel', subject: 'Physics', topic: 'Thermodynamics', date: 'Today', time: '5:30 PM', duration: '45 min', status: 'confirmed', earnings: 15 },
        { id: 3, student: 'Amit Kumar', subject: 'Mathematics', topic: 'Calculus', date: 'Tomorrow', time: '2:00 PM', duration: '30 min', status: 'pending', earnings: 10 },
        { id: 4, student: 'Sneha Gupta', subject: 'Chemistry', topic: 'Organic Chemistry', date: 'Tomorrow', time: '4:00 PM', duration: '30 min', status: 'pending', earnings: 10 },
        { id: 5, student: 'Vikram Singh', subject: 'Mathematics', topic: 'Algebra', date: 'Yesterday', time: '3:00 PM', duration: '30 min', status: 'completed', earnings: 10 },
        { id: 6, student: 'Neha Sharma', subject: 'Physics', topic: 'Mechanics', date: 'Yesterday', time: '5:00 PM', duration: '45 min', status: 'completed', earnings: 15 },
        { id: 7, student: 'Raj Patel', subject: 'Mathematics', topic: 'Trigonometry', date: '2 days ago', time: '2:00 PM', duration: '30 min', status: 'cancelled', earnings: 0 },
    ]

    const filteredSessions = sessions.filter(session => {
        if (filter === 'upcoming') return ['confirmed', 'pending'].includes(session.status)
        if (filter === 'completed') return session.status === 'completed'
        if (filter === 'cancelled') return session.status === 'cancelled'
        return true
    })

    const handleStartSession = (session) => {
        showToast(`Starting session with ${session.student}...`, 'info')
    }

    const handleConfirm = (session) => {
        showToast(`Session with ${session.student} confirmed!`, 'success')
    }

    const handleCancel = (session) => {
        showToast(`Session with ${session.student} cancelled.`, 'warning')
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'success'
            case 'pending': return 'warning'
            case 'completed': return 'info'
            case 'cancelled': return 'error'
            default: return 'default'
        }
    }

    // Calendar days
    const getDaysInWeek = () => {
        const today = new Date()
        const days = []
        for (let i = -2; i <= 4; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() + i)
            days.push(date)
        }
        return days
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
        <div className="sessions-page">
            <div className="page-header">
                <h1 className="page-title">My Sessions</h1>
                <p className="page-subtitle">Manage your tutoring sessions</p>
            </div>

            {/* Mini Calendar */}
            <div className="mini-calendar">
                <div className="calendar-header">
                    <h3>This Week</h3>
                    <div className="calendar-nav">
                        <button className="btn btn-ghost btn-sm">←</button>
                        <span>{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        <button className="btn btn-ghost btn-sm">→</button>
                    </div>
                </div>
                <div className="calendar-days">
                    {getDaysInWeek().map((date, i) => (
                        <button
                            key={i}
                            className={`calendar-day ${date.toDateString() === selectedDate.toDateString() ? 'selected' : ''} ${date.toDateString() === new Date().toDateString() ? 'today' : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            <span className="day-name">{weekDays[date.getDay()]}</span>
                            <span className="day-number">{date.getDate()}</span>
                            {(i === 2 || i === 3) && <span className="day-dot"></span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="sessions-filters">
                {['upcoming', 'completed', 'cancelled', 'all'].map(f => (
                    <button
                        key={f}
                        className={`filter-btn ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'upcoming' && '📅 Upcoming'}
                        {f === 'completed' && '✅ Completed'}
                        {f === 'cancelled' && '❌ Cancelled'}
                        {f === 'all' && '📋 All'}
                    </button>
                ))}
            </div>

            {/* Sessions List */}
            <div className="sessions-list-container">
                {filteredSessions.length > 0 ? (
                    <div className="sessions-list-full">
                        {filteredSessions.map(session => (
                            <div key={session.id} className="session-card">
                                <div className="session-main">
                                    <div className="session-student-info">
                                        <div className="student-avatar">{session.student.charAt(0)}</div>
                                        <div>
                                            <h4 className="session-student-name">{session.student}</h4>
                                            <span className="session-topic">{session.subject} • {session.topic}</span>
                                        </div>
                                    </div>
                                    <div className="session-datetime">
                                        <span className="session-date">{session.date}</span>
                                        <span className="session-time">{session.time}</span>
                                        <span className="session-duration">{session.duration}</span>
                                    </div>
                                    <div className="session-status-earning">
                                        <span className={`session-status-tag ${getStatusColor(session.status)}`}>
                                            {session.status}
                                        </span>
                                        {session.earnings > 0 && (
                                            <span className="session-earning">+{session.earnings} pts</span>
                                        )}
                                    </div>
                                    <div className="session-actions">
                                        {session.status === 'confirmed' && (
                                            <>
                                                <button className="btn btn-primary btn-sm" onClick={() => handleStartSession(session)}>
                                                    Start
                                                </button>
                                                <button className="btn btn-ghost btn-sm" onClick={() => handleCancel(session)}>
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                        {session.status === 'pending' && (
                                            <>
                                                <button className="btn btn-primary btn-sm" onClick={() => handleConfirm(session)}>
                                                    Confirm
                                                </button>
                                                <button className="btn btn-ghost btn-sm" onClick={() => handleCancel(session)}>
                                                    Decline
                                                </button>
                                            </>
                                        )}
                                        {session.status === 'completed' && (
                                            <button className="btn btn-secondary btn-sm">View Details</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon">📭</span>
                        <h3>No sessions found</h3>
                        <p>Try changing the filter to see more sessions</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Sessions
