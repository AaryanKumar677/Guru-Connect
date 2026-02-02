import React from 'react';
import { useNavigate } from 'react-router-dom';

const UpcomingSessions = ({ sessions }) => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-card animate-fade-in-up stagger-2">
            <div className="dashboard-card-header">
                <h3 className="section-title">📅 Upcoming Sessions</h3>
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate('/tutor/sessions')}
                >
                    View All
                </button>
            </div>
            <div className="dashboard-card-content">
                {sessions.length > 0 ? (
                    <div className="sessions-list">
                        {sessions.map(session => (
                            <div key={session.id} className="session-item tutor-session">
                                <div className="session-avatar">{session.avatar}</div>
                                <div className="session-info">
                                    <span className="session-student">{session.student}</span>
                                    <span className="session-subject">{session.subject}</span>
                                    <div className="session-time">
                                        <span className="time">{session.time}</span>
                                        <span className="duration">• {session.duration}</span>
                                    </div>
                                </div>
                                <div className="session-actions">
                                    <span className={`session-status ${session.status}`}>
                                        {session.status}
                                    </span>
                                    <button className="btn btn-primary btn-sm">
                                        {session.status === 'confirmed' ? 'Start' : 'Confirm'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No upcoming sessions scheduled 📚</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpcomingSessions;
