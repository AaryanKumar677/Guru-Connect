import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ user, sessions = [], nextActions = [] }) => {
    const navigate = useNavigate();

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Dynamic CTA Logic
    const getPrimaryAction = () => {
        // 1. Check for sessions starting soon
        const nextSession = sessions.find(s => s.status === 'upcoming' || s.status === 'live');

        if (nextSession) {
            return {
                label: `Join ${nextSession.subject} Session`,
                subLabel: `Starting ${nextSession.time}`,
                action: () => navigate(nextSession.joinUrl),
                type: 'urgent',
                icon: '🎥'
            };
        }

        // 2. Check for high priority tasks
        const urgentTask = nextActions.find(a => a.priority === 'high');
        if (urgentTask) {
            return {
                label: urgentTask.title,
                subLabel: `Due: ${urgentTask.due}`,
                action: () => navigate(urgentTask.link),
                type: 'warning',
                icon: '📝'
            };
        }

        // 3. Default fallback
        return {
            label: 'Find a Tutor',
            subLabel: 'Boost your learning today',
            action: () => navigate('/student/tutors'),
            type: 'primary',
            icon: '🔎'
        };
    };

    const primaryAction = getPrimaryAction();
    const firstName = user?.name?.split(' ')[0] || user?.fullName?.split(' ')[0] || 'Student';

    return (
        <header className="dashboard-header animate-fade-in">
            <div className="header-content">
                <h1 className="greeting">
                    {getGreeting()}, <span className="text-gradient">{firstName}</span>! 👋
                </h1>
                <p className="subtitle">Ready to continue your learning journey?</p>
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

export default DashboardHeader;
