import React from 'react';

const AchievementsWidget = ({ achievements }) => {
    return (
        <div className="dashboard-card animate-fade-in-up stagger-6">
            <div className="dashboard-card-header">
                <h3 className="section-title">🏆 Achievements</h3>
            </div>
            <div className="achievements-list">
                {achievements.map((achievement) => (
                    <div key={achievement.id} className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                        <div className="achievement-icon">{achievement.icon}</div>
                        <div className="achievement-info">
                            <h4 className="achievement-title">{achievement.title}</h4>
                            <span className="status-badge">{achievement.unlocked ? 'Unlocked' : 'Locked'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AchievementsWidget;
