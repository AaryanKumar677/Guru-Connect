/* ==============================
   Session List Component
   Shows recent/upcoming tutoring sessions with tutor info,
   subject, date/time, status badges, and join session actions
   ============================== */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionList = ({ sessions }) => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleJoinSession = (session) => {
        showToast(`Joining ${session.subject} session...`);
        // In a real app, this would navigate or open the session
        // setTimeout(() => navigate(session.joinUrl), 1500);
    };

    const handleReschedule = (session) => {
        showToast('Reschedule feature coming soon!');
    };

    return (
        <div className="dashboard-card animate-fade-in-up stagger-4">
            {toast && (
                <div className="toast-notification">
                    {toast}
                </div>
            )}

            <div className="dashboard-card-header">
                <h3 className="section-title">📅 Upcoming Sessions</h3>
            </div>
            <div className="sessions-list">
                {sessions.length > 0 ? (
                    sessions.map((session) => (
                        <div key={session.id} className="session-item">
                            <div className="session-avatar">{session.avatar}</div>
                            <div className="session-info">
                                <h4 className="session-tutor">{session.tutorName}</h4>
                                <p className="session-topic">{session.subject}: {session.topic}</p>
                                <div className="session-time">
                                    <span className="time-icon">⏰</span>
                                    {session.time}
                                </div>
                            </div>
                            <div className="session-actions">
                                {session.status === 'upcoming' && (
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => handleReschedule(session)}
                                    >
                                        Reschedule
                                    </button>
                                )}
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleJoinSession(session)}
                                >
                                    Join
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No upcoming sessions.</p>
                        <button className="btn btn-sm btn-primary" onClick={() => navigate('/student/tutors')}>Book One</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionList;
