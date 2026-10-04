/* ==============================
   Tutor Recommendations Component
   Displays recommended tutors based on student preferences,
   with tutor cards showing rating, subjects, price, and book button
   ============================== */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TutorRecommendations = ({ tutors }) => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleViewProfile = (tutor) => {
        showToast(`Opening ${tutor.name}'s profile...`);
        // In a real app: setTimeout(() => navigate(`/student/tutor/${tutor.id}`), 1000);
    };

    return (
        <div className="tutors-section animate-fade-in-up stagger-5">
            {toast && (
                <div className="toast-notification">
                    {toast}
                </div>
            )}

            <div className="recommendations-header">
                <h3 className="section-title">🎓 Recommended for You</h3>
                <button className="btn-link" onClick={() => navigate('/student/tutors')}>See All</button>
            </div>
            <div className="tutors-scroll-container">
                {tutors.map((tutor) => (
                    <div key={tutor.id} className="tutor-card card-glass">
                        <div className="tutor-header">
                            <span className="tutor-avatar-lg">{tutor.avatar}</span>
                            <div className="tutor-rating">⭐ {tutor.rating}</div>
                        </div>
                        <h4 className="tutor-name">{tutor.name}</h4>
                        <p className="tutor-subject">{tutor.subject}</p>
                        <div className="tutor-meta">
                            <span>🗓️ {tutor.nextAvailable}</span>
                            <span>💵 ${tutor.hourlyRate}/hr</span>
                        </div>
                        <button
                            className="btn btn-sm btn-secondary w-full"
                            onClick={() => handleViewProfile(tutor)}
                        >
                            View Profile
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TutorRecommendations;
