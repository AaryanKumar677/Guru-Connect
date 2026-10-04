/* ==============================
   Pending Requests Component
   Shows pending student session requests for tutors,
   with student info, subject, time, and accept/decline actions
   ============================== */
import React from 'react';

const PendingRequests = ({ requests }) => {
    const getUrgencyClass = (urgency) => {
        switch (urgency) {
            case 'high': return 'urgent';
            case 'medium': return 'medium';
            default: return 'normal';
        }
    };

    return (
        <div className="dashboard-card animate-fade-in-up stagger-3">
            <div className="dashboard-card-header">
                <h3 className="section-title">📩 Pending Requests</h3>
                {requests.length > 0 && (
                    <span className="request-badge">{requests.length} new</span>
                )}
            </div>
            <div className="dashboard-card-content">
                {requests.length > 0 ? (
                    <div className="requests-list">
                        {requests.map(request => (
                            <div
                                key={request.id}
                                className={`request-item ${getUrgencyClass(request.urgency)}`}
                            >
                                <div className="request-avatar">{request.avatar}</div>
                                <div className="request-info">
                                    <span className="request-student">{request.student}</span>
                                    <span className="request-subject">{request.subject}</span>
                                    <span className="request-message">{request.message}</span>
                                </div>
                                <div className="request-meta">
                                    <span className="request-time">{request.time}</span>
                                    <div className="request-actions">
                                        <button className="btn btn-primary btn-sm">Accept</button>
                                        <button className="btn btn-ghost btn-sm">Decline</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No pending requests 🎉</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingRequests;
