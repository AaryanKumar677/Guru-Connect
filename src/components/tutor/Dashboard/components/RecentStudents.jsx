/* ==============================
   Recent Students Component
   Displays recently interacted students for the tutor,
   with student avatar, name, last session date, and message button
   ============================== */
import React from 'react';

const RecentStudents = ({ students }) => {
    return (
        <div className="dashboard-card animate-fade-in-up stagger-4">
            <div className="dashboard-card-header">
                <h3 className="section-title">
                    <img
                        src="/assets/icons/active-students.png"
                        alt=""
                        width="24"
                        height="24"
                        className="section-icon"
                    />
                    Recent Students
                </h3>
            </div>
            <div className="dashboard-card-content">
                {students.length > 0 ? (
                    <div className="students-list">
                        {students.map(student => (
                            <div key={student.id} className="student-item">
                                <div className="student-avatar">{student.avatar}</div>
                                <div className="student-info">
                                    <span className="student-name">{student.name}</span>
                                    <span className="student-sessions">{student.sessions} sessions</span>
                                </div>
                                <div className="student-progress">
                                    <div className="progress-mini">
                                        <div
                                            className="progress-mini-fill"
                                            style={{ width: `${student.progress}%` }}
                                        />
                                    </div>
                                    <span className="progress-label">{student.progress}%</span>
                                </div>
                                <span className="student-last">{student.lastSession}</span>
                                <button className="btn btn-ghost btn-sm btn-icon">
                                    <img src="/assets/icons/chat.png" alt="Chat" width="20" height="20" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No students yet 📚</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentStudents;
