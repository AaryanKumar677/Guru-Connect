/* ==============================
   Tutor Stats Overview Component
   Displays tutor statistics (total students, sessions, earnings, rating)
   with formatted numbers and trend indicators
   ============================== */
import React from 'react';

const TutorStatsOverview = ({ stats }) => {
    const getIcon = (iconType) => {
        switch (iconType) {
            case 'earnings':
                return <img src="/assets/icons/total-earnings.png" alt="Earnings" width="24" height="24" />;
            case 'sessions':
                return '📚';
            case 'students':
                return <img src="/assets/icons/active-students.png" alt="Students" width="24" height="24" />;
            case 'rating':
                return <img src="/assets/icons/average-rating.png" alt="Rating" width="24" height="24" />;
            default:
                return '📊';
        }
    };

    const getColor = (iconType) => {
        switch (iconType) {
            case 'earnings': return 'green';
            case 'sessions': return 'blue';
            case 'students': return 'purple';
            case 'rating': return 'orange';
            default: return 'blue';
        }
    };

    return (
        <div className="stats-grid animate-fade-in-up stagger-1">
            {Object.values(stats).map((stat, index) => (
                <div key={index} className="stat-card card-glass">
                    <div className="stat-card-header">
                        <div className={`stat-card-icon ${getColor(stat.icon)}`}>
                            {getIcon(stat.icon)}
                        </div>
                        {stat.trend === 'up' && (
                            <span className="trend-badge positive">
                                ↑
                            </span>
                        )}
                    </div>
                    <div className="stat-card-value">{stat.value}</div>
                    <div className="stat-card-label">{stat.label}</div>
                    <div className="stat-card-trend up">{stat.delta}</div>
                </div>
            ))}
        </div>
    );
};

export default TutorStatsOverview;
