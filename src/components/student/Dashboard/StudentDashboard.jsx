import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../App'
import './StudentDashboard.css'

const StudentDashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [showAskDoubtModal, setShowAskDoubtModal] = useState(false)

    // Mock data
    const stats = {
        points: 250,
        doubtsResolved: 12,
        tutorSessions: 5,
        streak: 7
    }

    const recentDoubts = [
        { id: 1, title: 'How to solve differential equations?', subject: 'Mathematics', status: 'resolved', time: '2 hours ago' },
        { id: 2, title: 'Explain Newton\'s laws of motion', subject: 'Physics', status: 'pending', time: '5 hours ago' },
        { id: 3, title: 'What is the difference between DNA and RNA?', subject: 'Biology', status: 'resolved', time: '1 day ago' },
    ]

    const recommendedTutors = [
        { id: 1, name: 'Dr. Priya Sharma', subject: 'Mathematics', rating: 4.9, sessions: 120, avatar: '👩‍🏫', price: 10 },
        { id: 2, name: 'Prof. Rajesh Kumar', subject: 'Physics', rating: 4.8, sessions: 95, avatar: '👨‍🏫', price: 12 },
        { id: 3, name: 'Ms. Anjali Gupta', subject: 'Chemistry', rating: 4.7, sessions: 80, avatar: '👩‍🔬', price: 8 },
        { id: 4, name: 'Mr. Vikram Singh', subject: 'Biology', rating: 4.9, sessions: 110, avatar: '🧑‍🔬', price: 10 },
    ]

    const upcomingSessions = [
        { id: 1, tutor: 'Dr. Priya Sharma', subject: 'Mathematics', time: 'Today, 4:00 PM', duration: '30 min' },
    ]

    return (
        <div className="dashboard-page student-dashboard">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <h1 className="welcome-title">
                        Welcome back, <span className="text-gradient">{user?.name || 'Student'}</span>! 👋
                    </h1>
                    <p className="welcome-subtitle">
                        Ready to learn something new today? Let's make progress together.
                    </p>
                </div>
                <div className="welcome-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/student/ai-assistant')}
                    >
                        <span>
                            <svg viewBox="0 0 24 24" fill="black" width="24" height="24">
                                <path d="M12 2L14.4 7.2L20 9.6L14.4 12L12 17.2L9.6 12L4 9.6L9.6 7.2L12 2Z" />
                                <path d="M19 15L20 17L22 18L20 19L19 21L18 19L16 18L18 17L19 15Z" />
                                <path d="M5 16L6 18L8 19L6 20L5 22L4 20L2 19L4 18L5 16Z" />
                            </svg>
                        </span> Ask AI
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/student/tutors')}
                    >
                        <span>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H10V22H14V20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18Z" />
                                <path d="M12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z" />
                                <path d="M12 17C9.33 17 7 18.34 7 20V19H17V20C17 18.34 14.67 17 12 17Z" />
                            </svg>
                        </span> Find Tutor
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {/* ... existing stats ... */}
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon blue">🎯</div>
                    </div>
                    <div className="stat-card-value">{stats.points}</div>
                    <div className="stat-card-label">Points Balance</div>
                    <div className="stat-card-trend up">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                        +50 this week
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon green">✅</div>
                    </div>
                    <div className="stat-card-value">{stats.doubtsResolved}</div>
                    <div className="stat-card-label">Doubts Resolved</div>
                    <div className="stat-card-trend up">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                        +3 this week
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon orange">📞</div>
                    </div>
                    <div className="stat-card-value">{stats.tutorSessions}</div>
                    <div className="stat-card-label">Tutor Sessions</div>
                    <div className="stat-card-trend up">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                        +2 this week
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon purple">🔥</div>
                    </div>
                    <div className="stat-card-value">{stats.streak} days</div>
                    <div className="stat-card-label">Learning Streak</div>
                    <div className="stat-card-trend up">Keep it up!</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* ... existing sections ... */}

                {/* Quick Actions */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">⚡ Quick Actions</h3>
                    </div>
                    <div className="dashboard-card-content">
                        <div className="quick-actions">
                            <button className="quick-action-btn" onClick={() => navigate('/student/ai-assistant')}>
                                <span className="quick-action-icon">
                                    <svg viewBox="0 0 24 24" fill="black" width="24" height="24">
                                        <path d="M12 2L14.4 7.2L20 9.6L14.4 12L12 17.2L9.6 12L4 9.6L9.6 7.2L12 2Z" />
                                        <path d="M19 15L20 17L22 18L20 19L19 21L18 19L16 18L18 17L19 15Z" />
                                        <path d="M5 16L6 18L8 19L6 20L5 22L4 20L2 19L4 18L5 16Z" />
                                    </svg>
                                </span>
                                <span className="quick-action-text">Ask AI</span>
                            </button>
                            <button className="quick-action-btn" onClick={() => navigate('/student/tutors')}>
                                <span className="quick-action-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                        <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H10V22H14V20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18Z" />
                                        <path d="M12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z" />
                                        <path d="M12 17C9.33 17 7 18.34 7 20V19H17V20C17 18.34 14.67 17 12 17Z" />
                                    </svg>
                                </span>
                                <span className="quick-action-text">Find Tutor</span>
                            </button>
                            <button className="quick-action-btn" onClick={() => navigate('/student/subscription')}>
                                <span className="quick-action-icon">💎</span>
                                <span className="quick-action-text">Get Points</span>
                            </button>
                            <button className="quick-action-btn" onClick={() => navigate('/student/doubts')}>
                                <span className="quick-action-icon">
                                    <img src="/assets/icons/my-doubts.png" alt="My Doubts" width="24" height="24" />
                                </span>
                                <span className="quick-action-text">My Doubts</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Assistant Preview */}
                <div className="dashboard-card ai-preview-card">
                    <div className="ai-preview-content">
                        <div className="ai-preview-icon">
                            <svg viewBox="0 0 24 24" fill="black" width="32" height="32">
                                <path d="M12 2L14.4 7.2L20 9.6L14.4 12L12 17.2L9.6 12L4 9.6L9.6 7.2L12 2Z" />
                                <path d="M19 15L20 17L22 18L20 19L19 21L18 19L16 18L18 17L19 15Z" />
                                <path d="M5 16L6 18L8 19L6 20L5 22L4 20L2 19L4 18L5 16Z" />
                            </svg>
                        </div>
                        <div className="ai-preview-text">
                            <h4>AI Assistant</h4>
                            <p>Get instant answers to your doubts 24/7</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/student/ai-assistant')}>
                            Start Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard
