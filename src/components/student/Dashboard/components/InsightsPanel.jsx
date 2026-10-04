/* ==============================
   Insights Panel Component
   Shows learning insights and analytics for students,
   including study patterns, subject progress, and weekly summary
   ============================== */
import React from 'react';

const InsightsPanel = ({ insights }) => {
    return (
        <div className="dashboard-card animate-fade-in-up stagger-3">
            <div className="dashboard-card-header">
                <h3 className="section-title">🧠 AI Insights</h3>
            </div>
            <div className="insights-content">
                <div className="progress-section">
                    <div className="progress-header">
                        <span>Overall Progress</span>
                        <span className="progress-value">{insights.learningProgress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${insights.learningProgress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="areas-grid">
                    <div className="area-column weak">
                        <h4>Focus Areas</h4>
                        {insights.weakAreas.map((area, idx) => (
                            <div key={idx} className="area-pill warn">
                                <span className="area-subject">{area.subject}</span>
                                <span className="area-topic">{area.topic}</span>
                            </div>
                        ))}
                    </div>
                    <div className="area-column strong">
                        <h4>Strong Points</h4>
                        {insights.strongAreas.map((area, idx) => (
                            <div key={idx} className="area-pill success">
                                <span className="area-subject">{area.subject}</span>
                                <span className="area-topic">{area.topic}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightsPanel;
