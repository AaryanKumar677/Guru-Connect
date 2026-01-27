import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../App'
import './TutorDashboard.css'

const TutorDashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const stats = {
        earnings: 4500,
        sessions: 45,
        students: 28,
        rating: 4.8,
        pendingRequests: 3
    }

    const upcomingSessions = [
        { id: 1, student: 'Rahul Sharma', subject: 'Mathematics', time: 'Today, 4:00 PM', duration: '30 min', status: 'confirmed' },
        { id: 2, student: 'Priya Patel', subject: 'Physics', time: 'Today, 5:30 PM', duration: '45 min', status: 'confirmed' },
        { id: 3, student: 'Amit Kumar', subject: 'Mathematics', time: 'Tomorrow, 2:00 PM', duration: '30 min', status: 'pending' },
    ]

    const recentStudents = [
        { id: 1, name: 'Rahul Sharma', sessions: 12, lastSession: '2 hours ago', avatar: '👦' },
        { id: 2, name: 'Priya Patel', sessions: 8, lastSession: 'Yesterday', avatar: '👧' },
        { id: 3, name: 'Amit Kumar', sessions: 5, lastSession: '3 days ago', avatar: '👦' },
        { id: 4, name: 'Sneha Gupta', sessions: 3, lastSession: '1 week ago', avatar: '👧' },
    ]

    const pendingRequests = [
        { id: 1, student: 'Vikram Singh', subject: 'Calculus', time: 'Tomorrow, 3:00 PM', message: 'Need help with integration' },
        { id: 2, student: 'Neha Sharma', subject: 'Algebra', time: 'Next Week', message: 'Preparing for final exams' },
        { id: 3, student: 'Raj Patel', subject: 'Trigonometry', time: 'Flexible', message: 'Weekly tutoring sessions' },
    ]

    return (
        <div className="dashboard-page tutor-dashboard">
            {/* Welcome Section */}
            <div className="welcome-section tutor">
                <div className="welcome-content">
                    <h1 className="welcome-title">
                        Hello, <span className="text-gradient">{user?.name || 'Tutor'}</span>! <img src="/assets/icons/tutor-role.png" alt="Tutor" width="32" height="32" style={{ verticalAlign: 'bottom' }} />
                    </h1>
                    <p className="welcome-subtitle">
                        You have {stats.pendingRequests} pending requests and {upcomingSessions.length} sessions today.
                    </p>
                </div>
                <div className="welcome-actions">
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/tutor/sessions')}>
                        <span>📅</span> View Sessions
                    </button>

                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon green">
                            <img src="/assets/icons/total-earnings.png" alt="Earnings" width="24" height="24" />
                        </div>
                    </div>
                    <div className="stat-card-value">₹{stats.earnings}</div>
                    <div className="stat-card-label">Total Earnings</div>
                    <div className="stat-card-trend up">+₹1,200 this week</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon blue">📚</div>
                    </div>
                    <div className="stat-card-value">{stats.sessions}</div>
                    <div className="stat-card-label">Sessions Completed</div>
                    <div className="stat-card-trend up">+8 this week</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon purple">
                            <img src="/assets/icons/active-students.png" alt="Active Students" width="24" height="24" />
                        </div>
                    </div>
                    <div className="stat-card-value">{stats.students}</div>
                    <div className="stat-card-label">Active Students</div>
                    <div className="stat-card-trend up">+3 new this week</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon orange">
                            <img src="/assets/icons/average-rating.png" alt="Average Rating" width="24" height="24" />
                        </div>
                    </div>
                    <div className="stat-card-value">{stats.rating}</div>
                    <div className="stat-card-label">Average Rating</div>
                    <div className="stat-card-trend up">Based on 120 reviews</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Upcoming Sessions */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">📅 Upcoming Sessions</h3>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tutor/sessions')}>View All</button>
                    </div>
                    <div className="dashboard-card-content">
                        <div className="sessions-list">
                            {upcomingSessions.map(session => (
                                <div key={session.id} className="session-item tutor-session">
                                    <div className="session-info">
                                        <span className="session-student">{session.student}</span>
                                        <span className="session-subject">{session.subject}</span>
                                    </div>
                                    <div className="session-time">
                                        <span className="time">{session.time}</span>
                                        <span className="duration">{session.duration}</span>
                                    </div>
                                    <span className={`session-status ${session.status}`}>
                                        {session.status}
                                    </span>
                                    <button className="btn btn-primary btn-sm">
                                        {session.status === 'confirmed' ? 'Start' : 'Confirm'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">📩 Pending Requests</h3>
                        <span className="request-badge">{pendingRequests.length} new</span>
                    </div>
                    <div className="dashboard-card-content">
                        <div className="requests-list">
                            {pendingRequests.map(request => (
                                <div key={request.id} className="request-item">
                                    <div className="request-info">
                                        <span className="request-student">{request.student}</span>
                                        <span className="request-subject">{request.subject}</span>
                                        <span className="request-message">{request.message}</span>
                                    </div>
                                    <span className="request-time">{request.time}</span>
                                    <div className="request-actions">
                                        <button className="btn btn-primary btn-sm">Accept</button>
                                        <button className="btn btn-ghost btn-sm">Decline</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Students */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title"><img src="/assets/icons/active-students.png" alt="Students" width="24" height="24" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Recent Students</h3>
                    </div>
                    <div className="dashboard-card-content">
                        <div className="students-list">
                            {recentStudents.map(student => (
                                <div key={student.id} className="student-item">
                                    <div className="student-avatar">{student.avatar}</div>
                                    <div className="student-info">
                                        <span className="student-name">{student.name}</span>
                                        <span className="student-sessions">{student.sessions} sessions</span>
                                    </div>
                                    <span className="student-last">{student.lastSession}</span>
                                    <button className="btn btn-ghost btn-sm">
                                        <img src="/assets/icons/chat.png" alt="Chat" width="20" height="20" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">⚡ Quick Actions</h3>
                    </div>
                    <div className="dashboard-card-content">
                        <div className="quick-actions">
                            <button className="quick-action-btn" onClick={() => navigate('/tutor/sessions')}>
                                <span className="quick-action-icon">📅</span>
                                <span className="quick-action-text">Manage Sessions</span>
                            </button>
                            <button className="quick-action-btn" onClick={() => navigate('/tutor/profile')}>
                                <span className="quick-action-icon">⏰</span>
                                <span className="quick-action-text">Set Availability</span>
                            </button>
                            <button className="quick-action-btn" onClick={() => navigate('/tutor/earnings')}>
                                <span className="quick-action-icon"><img src="/assets/icons/total-earnings.png" alt="Earnings" width="24" height="24" /></span>
                                <span className="quick-action-text">Earnings</span>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TutorDashboard
