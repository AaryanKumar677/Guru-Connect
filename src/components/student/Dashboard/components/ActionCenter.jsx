import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionCenter = ({ actions }) => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-card animate-fade-in-up stagger-2">
            <div className="dashboard-card-header">
                <h3 className="section-title">⚡ Next Actions</h3>
            </div>
            <div className="action-list">
                {actions.length > 0 ? (
                    actions.map((action) => (
                        <div key={action.id} className={`action-item ${action.priority}`}>
                            <div className="action-icon">
                                {action.type === 'assignment' ? '📝' : '❓'}
                            </div>
                            <div className="action-content">
                                <h4 className="action-title">{action.title}</h4>
                                <p className="action-meta">{action.due}</p>
                            </div>
                            <button
                                className="btn btn-sm btn-secondary"
                                aria-label={`Start ${action.title}`}
                                onClick={() => navigate(action.link)}
                            >
                                Start
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>You're all caught up! 🎉</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActionCenter;
