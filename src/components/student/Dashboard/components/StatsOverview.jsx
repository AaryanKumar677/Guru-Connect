/* ==============================
   Stats Overview Component
   Displays student statistics cards (sessions completed, hours learned,
   doubts solved, streak days) with icons and formatted numbers
   ============================== */
import React from 'react';

const StatsOverview = ({ stats }) => {
    const getIcon = (label) => {
        switch (label) {
            case 'Total Points': return '🎯';
            case 'Doubts Resolved': return '✅';
            case 'Sessions Completed': return '📞';
            case 'Day Streak': return '🔥';
            default: return '📊';
        }
    };

    const getColor = (label) => {
        switch (label) {
            case 'Total Points': return 'blue';
            case 'Doubts Resolved': return 'green';
            case 'Sessions Completed': return 'orange';
            case 'Day Streak': return 'purple';
            default: return 'blue';
        }
    };

    return (
        <div className="stats-grid animate-fade-in-up stagger-1">
            {Object.values(stats).map((stat, index) => (
                <div key={index} className="stat-card card-glass">
                    <div className="stat-card-header">
                        <div className={`stat-card-icon ${getColor(stat.label)}`}>
                            {getIcon(stat.label)}
                        </div>
                        {stat.trend === 'up' && (
                            <span className="trend-badge positive">
                                ↑ {stat.delta}
                            </span>
                        )}
                    </div>
                    <div className="stat-card-value">{stat.value}</div>
                    <div className="stat-card-label">{stat.label}</div>
                </div>
            ))}
        </div>
    );
};

export default StatsOverview;
