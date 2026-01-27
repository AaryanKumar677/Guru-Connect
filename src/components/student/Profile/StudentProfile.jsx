import { useState } from 'react'
import { useAuth, useToast } from '../../../App'
import './StudentProfile.css'

const StudentProfile = () => {
    const { user, updateUser } = useAuth()
    const { showToast } = useToast()

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        school: user?.school || '',
        grade: user?.grade || '',
        subjects: user?.subjects || ['Mathematics', 'Physics'],
        bio: user?.bio || ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        updateUser(formData)
        setIsEditing(false)
        showToast('Profile updated successfully!', 'success')
    }

    const stats = [
        { label: 'Doubts Solved', value: '47', icon: '✅' },
        { label: 'Sessions Done', value: '12', icon: '📞' },
        { label: 'Points Earned', value: '2,450', icon: '⭐' },
        { label: 'Day Streak', value: '15', icon: '🔥' }
    ]

    const achievements = [
        { icon: '🏆', title: 'First Doubt', desc: 'Asked your first doubt' },
        { icon: '📚', title: 'Bookworm', desc: 'Completed 10 sessions' },
        { icon: '⭐', title: 'Rising Star', desc: 'Earned 1000 points' },
        { icon: '🎯', title: 'Consistent', desc: '7 day streak achieved' }
    ]

    return (
        <div className="student-profile-page">
            <div className="page-header">
                <h1 className="page-title">My Profile</h1>
                <button
                    className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                >
                    {isEditing ? '💾 Save Changes' : (
                        <>
                            <img src="/assets/icons/edit-profile.png" alt="Edit" width="20" height="20" />
                            <span>Edit Profile</span>
                        </>
                    )}
                </button>
            </div>

            <div className="profile-grid">
                {/* Profile Card */}
                <div className="profile-card main">
                    <div className="profile-header">
                        <div className="profile-avatar-large">
                            {user?.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div className="profile-info">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="edit-input name"
                                    placeholder="Your name"
                                />
                            ) : (
                                <h2 className="profile-name">{user?.name || 'Student'}</h2>
                            )}
                            <span className="profile-role">🎓 Student</span>
                            <span className="profile-joined">Member since Jan 2026</span>
                        </div>
                    </div>

                    <div className="profile-details">
                        <div className="detail-group">
                            <label>Email</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="edit-input"
                                />
                            ) : (
                                <span>{user?.email || 'Not set'}</span>
                            )}
                        </div>
                        <div className="detail-group">
                            <label>Phone</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="edit-input"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            ) : (
                                <span>{formData.phone || 'Not set'}</span>
                            )}
                        </div>
                        <div className="detail-group">
                            <label>School/College</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="school"
                                    value={formData.school}
                                    onChange={handleChange}
                                    className="edit-input"
                                    placeholder="Your institution"
                                />
                            ) : (
                                <span>{formData.school || 'Not set'}</span>
                            )}
                        </div>
                        <div className="detail-group">
                            <label>Grade/Year</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    className="edit-input"
                                    placeholder="e.g., Class 12, 2nd Year"
                                />
                            ) : (
                                <span>{formData.grade || 'Not set'}</span>
                            )}
                        </div>
                        <div className="detail-group full">
                            <label>Bio</label>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="edit-input"
                                    placeholder="Tell us about yourself..."
                                    rows={3}
                                />
                            ) : (
                                <span>{formData.bio || 'No bio added yet'}</span>
                            )}
                        </div>
                    </div>

                    <div className="profile-subjects">
                        <label>Interested Subjects</label>
                        <div className="subject-tags">
                            {formData.subjects.map((subject, i) => (
                                <span key={i} className="subject-tag">{subject}</span>
                            ))}
                            {isEditing && (
                                <button className="add-subject-btn">+ Add</button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="profile-card stats">
                    <h3>📊 Your Stats</h3>
                    <div className="stats-grid">
                        {stats.map((stat, i) => (
                            <div key={i} className="stat-box">
                                <span className="stat-icon">{stat.icon}</span>
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Achievements */}
                <div className="profile-card achievements">
                    <h3>🏅 Achievements</h3>
                    <div className="achievements-list">
                        {achievements.map((ach, i) => (
                            <div key={i} className="achievement-item">
                                <span className="achievement-icon">{ach.icon}</span>
                                <div className="achievement-info">
                                    <span className="achievement-title">{ach.title}</span>
                                    <span className="achievement-desc">{ach.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentProfile
