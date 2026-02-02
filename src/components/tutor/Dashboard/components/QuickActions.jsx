import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ actions }) => {
    const navigate = useNavigate();

    const getIcon = (iconType) => {
        if (iconType === 'earnings') {
            return <img src="/assets/icons/total-earnings.png" alt="Earnings" width="24" height="24" />;
        }
        return iconType;
    };

    return (
        <div className="dashboard-card animate-fade-in-up stagger-5">
            <div className="dashboard-card-header">
                <h3 className="section-title">⚡ Quick Actions</h3>
            </div>
            <div className="dashboard-card-content">
                <div className="quick-actions-grid">
                    {actions.map(action => (
                        <button
                            key={action.id}
                            className={`quick-action-btn ${action.color}`}
                            onClick={() => navigate(action.link)}
                        >
                            <span className="quick-action-icon">
                                {getIcon(action.icon)}
                            </span>
                            <span className="quick-action-text">{action.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuickActions;
