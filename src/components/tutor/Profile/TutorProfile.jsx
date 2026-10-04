/* ==============================
   Tutor Profile Component - Edit Profile Page
   Tutor profile management with personal info, teaching subjects,
   experience, hourly rate, bio, education, avatar upload, and availability
   ============================== */
import { useState } from 'react'
import { useAuth, useToast } from '../../../App'
import ProfileImageUpload from '../../common/ProfileImageUpload/ProfileImageUpload'
import './TutorProfile.css'

const TutorProfile = () => {
    const { user, updateUser } = useAuth()
    const { showToast } = useToast()

    const [profileData, setProfileData] = useState({
        name: user?.name || user?.fullName || '',
        email: user?.email || '',
        bio: user?.bio || '',
        subjects: user?.subjects || [],
        teachingStyle: user?.teachingStyle || '',
        languages: user?.languages || [],
        experience: user?.experience || '',
        education: user?.education || user?.collegeName || '',
        hourlyRate: user?.hourlyRate || 0,
        availability: user?.availability || {
            monday: { enabled: true, slots: [] },
            tuesday: { enabled: true, slots: [] },
            wednesday: { enabled: true, slots: [] },
            thursday: { enabled: true, slots: [] },
            friday: { enabled: true, slots: [] },
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

    const handleImageUpdate = (newAvatarUrl) => {
        updateUser({ avatar: newAvatarUrl })
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
                        {isEditing ? (
                            <ProfileImageUpload
                                userId={user?.id}
                                currentAvatar={user?.avatar}
                                userName={user?.name || user?.fullName}
                                onImageUpdate={handleImageUpdate}
                            />
                        ) : (
                            <div className="profile-avatar-large">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={profileData.name} className="avatar-img" />
                                ) : (
                                    (profileData.name || user?.name || user?.fullName)?.charAt(0).toUpperCase() || 'T'
                                )}
                            </div>
                        )}
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
                                <p className={!profileData.bio ? 'placeholder-text' : ''}>
                                    {profileData.bio || 'Add a bio to tell students about yourself...'}
                                </p>
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
                                    {profileData.subjects.length > 0 ? (
                                        profileData.subjects.map(subject => (
                                            <span key={subject} className="tag">{subject}</span>
                                        ))
                                    ) : (
                                        <span className="placeholder-text">No subjects selected. Click Edit to add.</span>
                                    )}
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
                                <p className={!profileData.teachingStyle ? 'placeholder-text' : ''}>
                                    {profileData.teachingStyle || 'Describe your teaching style...'}
                                </p>
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
                                    {profileData.languages.length > 0 ? (
                                        profileData.languages.map(lang => (
                                            <span key={lang} className="tag">{lang}</span>
                                        ))
                                    ) : (
                                        <span className="placeholder-text">No languages added in.</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Experience */}
                        <div className="profile-section">
                            <h3>Experience (Years)</h3>
                            {isEditing ? (
                                <select
                                    value={profileData.experience}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                                    className="input"
                                >
                                    <option value="" disabled>Select Experience</option>
                                    <option value="0-1">0-1 Years</option>
                                    <option value="1-3">1-3 Years</option>
                                    <option value="3-5">3-5 Years</option>
                                    <option value="5-10">5-10 Years</option>
                                    <option value="10+">10+ Years</option>
                                </select>
                            ) : (
                                <p className={!profileData.experience ? 'placeholder-text' : ''}>
                                    {profileData.experience ? `${profileData.experience} Years` : 'Add your teaching experience...'}
                                </p>
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
                                <p className={!profileData.education ? 'placeholder-text' : ''}>
                                    {profileData.education || 'Add your educational background...'}
                                </p>
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
