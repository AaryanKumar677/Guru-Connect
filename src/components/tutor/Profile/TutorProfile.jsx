import { useState } from 'react'
import { useAuth, useToast } from '../../../App'
import './TutorProfile.css'

const TutorProfile = () => {
    const { user, updateUser } = useAuth()
    const { showToast } = useToast()

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || 'Passionate educator with years of experience helping students achieve their academic goals.',
        subjects: user?.subjects || ['Mathematics', 'Physics'],
        teachingStyle: user?.teachingStyle || 'Interactive and hands-on approach with real-world examples.',
        languages: user?.languages || ['English', 'Hindi'],
        experience: user?.experience || '5-10',
        education: 'PhD in Mathematics, IIT Delhi',
        hourlyRate: 10,
        availability: {
            monday: { enabled: true, slots: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'] },
            tuesday: { enabled: true, slots: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'] },
            wednesday: { enabled: true, slots: ['9:00 AM - 12:00 PM'] },
            thursday: { enabled: true, slots: ['2:00 PM - 6:00 PM'] },
            friday: { enabled: true, slots: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'] },
            saturday: { enabled: false, slots: [] },
            sunday: { enabled: false, slots: [] },
        }
    })

    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')

    const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'History', 'Economics']
    const languageOptions = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi']
    const timeSlots = ['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM', '6:00 PM - 9:00 PM']

    const handleSave = () => {
        updateUser(profileData)
        setIsEditing(false)
        showToast('Profile updated successfully!', 'success')
    }

    const toggleSubject = (subject) => {
        setProfileData(prev => ({
            ...prev,
            subjects: prev.subjects.includes(subject)
                ? prev.subjects.filter(s => s !== subject)
                : [...prev.subjects, subject]
        }))
    }

    const toggleLanguage = (lang) => {
        setProfileData(prev => ({
            ...prev,
            languages: prev.languages.includes(lang)
                ? prev.languages.filter(l => l !== lang)
                : [...prev.languages, lang]
        }))
    }

    const toggleDayAvailability = (day) => {
        setProfileData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                [day]: {
                    ...prev.availability[day],
                    enabled: !prev.availability[day].enabled
                }
            }
        }))
    }

    const toggleSlot = (day, slot) => {
        setProfileData(prev => {
            const currentSlots = prev.availability[day].slots
            const newSlots = currentSlots.includes(slot)
                ? currentSlots.filter(s => s !== slot)
                : [...currentSlots, slot]
            return {
                ...prev,
                availability: {
                    ...prev.availability,
                    [day]: { ...prev.availability[day], slots: newSlots }
                }
            }
        })
    }

    const completionPercentage = () => {
        let completed = 0
        const total = 7
        if (profileData.name) completed++
        if (profileData.bio) completed++
        if (profileData.subjects.length > 0) completed++
        if (profileData.teachingStyle) completed++
        if (profileData.languages.length > 0) completed++
        if (profileData.education) completed++
        if (Object.values(profileData.availability).some(d => d.enabled)) completed++
        return Math.round((completed / total) * 100)
    }

    return (
        <div className="tutor-profile-page">
            <div className="page-header">
                <h1 className="page-title">My Profile</h1>
                <p className="page-subtitle">Manage your tutor profile and availability</p>
            </div>

            {/* Profile Completion */}
            <div className="completion-card">
                <div className="completion-info">
                    <span className="completion-icon">📋</span>
                    <div>
                        <h3>Profile Completion</h3>
                        <p>Complete your profile to attract more students</p>
                    </div>
                </div>
                <div className="completion-bar">
                    <div className="completion-progress" style={{ width: `${completionPercentage()}%` }}></div>
                </div>
                <span className="completion-percent">{completionPercentage()}%</span>
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
                <button
                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    👤 Profile Info
                </button>
                <button
                    className={`tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
                    onClick={() => setActiveTab('availability')}
                >
                    📅 Availability
                </button>
                <button
                    className={`tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pricing')}
                >
                    💰 Pricing
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="profile-content">
                    <div className="profile-header-card">
                        <div className="profile-avatar-large">
                            {profileData.name?.charAt(0).toUpperCase() || 'T'}
                        </div>
                        <div className="profile-header-info">
                            <h2>{profileData.name}</h2>
                            <p>{profileData.email}</p>
                            <div className="profile-badges">
                                <span className="badge badge-success">✓ Verified</span>
                                <span className="badge badge-primary">
                                    <img src="/assets/icons/average-rating.png" alt="Rating" width="14" height="14" style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                    4.8 Rating
                                </span>
                            </div>
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Cancel' : (
                                <>
                                    <img src="/assets/icons/edit-profile.png" alt="Edit" width="20" height="20" />
                                    <span>Edit Profile</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="profile-sections">
                        {/* Bio */}
                        <div className="profile-section">
                            <h3>About Me</h3>
                            {isEditing ? (
                                <textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                    className="input textarea"
                                    rows={4}
                                />
                            ) : (
                                <p>{profileData.bio}</p>
                            )}
                        </div>

                        {/* Subjects */}
                        <div className="profile-section">
                            <h3>Subjects I Teach</h3>
                            {isEditing ? (
                                <div className="tag-selector">
                                    {subjectOptions.map(subject => (
                                        <button
                                            key={subject}
                                            className={`tag-btn ${profileData.subjects.includes(subject) ? 'active' : ''}`}
                                            onClick={() => toggleSubject(subject)}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="tags-display">
                                    {profileData.subjects.map(subject => (
                                        <span key={subject} className="tag">{subject}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Teaching Style */}
                        <div className="profile-section">
                            <h3>Teaching Style</h3>
                            {isEditing ? (
                                <textarea
                                    value={profileData.teachingStyle}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, teachingStyle: e.target.value }))}
                                    className="input textarea"
                                    rows={3}
                                />
                            ) : (
                                <p>{profileData.teachingStyle}</p>
                            )}
                        </div>

                        {/* Languages */}
                        <div className="profile-section">
                            <h3>Languages</h3>
                            {isEditing ? (
                                <div className="tag-selector">
                                    {languageOptions.map(lang => (
                                        <button
                                            key={lang}
                                            className={`tag-btn ${profileData.languages.includes(lang) ? 'active' : ''}`}
                                            onClick={() => toggleLanguage(lang)}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="tags-display">
                                    {profileData.languages.map(lang => (
                                        <span key={lang} className="tag">{lang}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Education */}
                        <div className="profile-section">
                            <h3>Education</h3>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profileData.education}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                                    className="input"
                                />
                            ) : (
                                <p>{profileData.education}</p>
                            )}
                        </div>

                        {isEditing && (
                            <button className="btn btn-primary save-btn" onClick={handleSave}>
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
                <div className="availability-content">
                    <div className="availability-grid">
                        {Object.entries(profileData.availability).map(([day, data]) => (
                            <div key={day} className={`day-card ${data.enabled ? 'enabled' : 'disabled'}`}>
                                <div className="day-header">
                                    <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={data.enabled}
                                            onChange={() => toggleDayAvailability(day)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                {data.enabled && (
                                    <div className="time-slots">
                                        {timeSlots.map(slot => (
                                            <button
                                                key={slot}
                                                className={`slot-btn ${data.slots.includes(slot) ? 'active' : ''}`}
                                                onClick={() => toggleSlot(day, slot)}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
                <div className="pricing-content">
                    <div className="pricing-card">
                        <h3>Session Rate</h3>
                        <div className="rate-input">
                            <input
                                type="number"
                                value={profileData.hourlyRate}
                                onChange={(e) => setProfileData(prev => ({ ...prev, hourlyRate: parseInt(e.target.value) }))}
                                className="input rate-field"
                            />
                            <span className="rate-unit">points per 30-min session</span>
                        </div>
                        <p className="rate-hint">Students will see this rate when booking sessions with you.</p>
                    </div>

                    <div className="pricing-card">
                        <h3>Free Demo Sessions</h3>
                        <label className="checkbox-label">
                            <input type="checkbox" defaultChecked />
                            Offer free 10-minute demo sessions to new students
                        </label>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TutorProfile
