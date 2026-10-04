/* ==============================
   Tutor Dashboard Header Component
   Tutor dashboard welcome header with greeting, tutor name,
   today date, and quick overview summary
   ============================== */
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TutorDashboardHeader = ({ user, sessions = [], requests = [] }) => {
    const navigate = useNavigate();

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Dynamic CTA Logic for tutors
    const getPrimaryAction = () => {
        // 1. Check for sessions starting soon
        const confirmedSession = sessions.find(s => s.status === 'confirmed');
        if (confirmedSession) {
            return {
                label: `Start ${confirmedSession.subject} Session`,
                subLabel: `With ${confirmedSession.student} · ${confirmedSession.time}`,
                action: () => navigate('/tutor/sessions'),
                type: 'urgent',
                icon: '🎥'
            };
        }

        // 2. Check for pending requests
        if (requests.length > 0) {
            return {
                label: `${requests.length} Pending Requests`,
                subLabel: 'Review and respond to students',
                action: () => navigate('/tutor/sessions'),
                type: 'warning',
                icon: '📩'
            };
        }

        // 3. Default fallback
        return {
            label: 'View Your Sessions',
            subLabel: 'Manage your tutoring schedule',
            action: () => navigate('/tutor/sessions'),
            type: 'primary',
            icon: '📅'
        };
    };

    const primaryAction = getPrimaryAction();
    const firstName = user?.name?.split(' ')[0] || user?.fullName?.split(' ')[0] || 'Tutor';
    const pendingCount = requests.length;
    const sessionsToday = sessions.filter(s => s.time.includes('Today')).length;

    return (
        <header className="tutor-dashboard-header animate-fade-in">
            <div className="header-content">
                <div className="header-text">
                    <h1 className="greeting">
                        {getGreeting()}, <span className="text-gradient-gold">{firstName}</span>!
                        <img src="/assets/icons/tutor-role.png" alt="" width="32" height="32" className="greeting-icon" />
                    </h1>
                    <p className="subtitle">
                        {pendingCount > 0 && <span className="highlight-badge">{pendingCount} pending requests</span>}
                        {pendingCount > 0 && sessionsToday > 0 && ' · '}
                        {sessionsToday > 0 && `${sessionsToday} sessions today`}
                        {pendingCount === 0 && sessionsToday === 0 && 'Your teaching dashboard is ready'}
                    </p>
                </div>
            </div>

            <div className="cta-container">
                <button
                    className={`primary-cta-btn ${primaryAction.type}`}
                    onClick={primaryAction.action}
                    aria-label={primaryAction.label}
                >
                    <span className="cta-icon">{primaryAction.icon}</span>
                    <div className="cta-text">
                        <span className="cta-label">{primaryAction.label}</span>
                        <span className="cta-sublabel">{primaryAction.subLabel}</span>
                    </div>
                    <span className="cta-arrow">→</span>
                </button>
            </div>
        </header>
    );
};

export default TutorDashboardHeader;
