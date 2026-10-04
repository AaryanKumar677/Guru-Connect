/* ==============================
   Student Profile Component - Edit Profile Page
   Student profile management with personal info, education details,
   avatar upload, language preferences, and save/cancel functionality
   ============================== */
import { useState, useEffect } from 'react'
import { useAuth, useToast } from '../../../App'
import ProfileImageUpload from '../../common/ProfileImageUpload/ProfileImageUpload'
import CollegeAutocomplete from '../../auth/CollegeAutocomplete/CollegeAutocomplete'
import { getCollegeMeta, getYearOptions, getSemesterOptions, getOrdinalSuffix } from '../../../services/collegeService'
import './StudentProfile.css'

const StudentProfile = () => {
    const { user, updateUser } = useAuth()
    const { showToast } = useToast()

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        educationType: user?.educationType || 'school',
        schoolName: user?.schoolName || '',
        collegeId: user?.collegeId || '',
        collegeName: user?.collegeName || '',
        grade: user?.grade || '',
        course: user?.course || user?.degree || '', // Unified as course
        branch: user?.branch || '',
        year: user?.year || '',
        semester: user?.semester || '',
        subjects: user?.subjects || ['Mathematics', 'Physics'],
        bio: user?.bio || ''
    })

    // Dynamic options state
    const [courseOptions, setCourseOptions] = useState([])
    const [branchOptions, setBranchOptions] = useState([])
    const [yearOptions, setYearOptions] = useState([])
    const [semesterOptions, setSemesterOptions] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        updateUser(formData)
        setIsEditing(false)
        showToast('Profile updated successfully!', 'success')
    }

    // Load college metadata when collegeId changes
    useEffect(() => {
        const loadMeta = async () => {
            if (formData.collegeId) {
                const meta = await getCollegeMeta(formData.collegeId)
                setCourseOptions(meta.degrees || [])
            } else {
                setCourseOptions([])
            }
        }
        loadMeta()
    }, [formData.collegeId])

    // Update year and branch options when course changes
    useEffect(() => {
        const loadCourseDetails = async () => {
            if (!formData.collegeId || !formData.course) {
                setYearOptions([])
                setBranchOptions([])
                return
            }

            const meta = await getCollegeMeta(formData.collegeId)
            // Find degree ID based on selected course name
            const courseObj = meta.degrees?.find(d => d.name === formData.course)

            if (courseObj) {
                setYearOptions(getYearOptions(courseObj.duration))

                // Set branches if available for this degree
                const branches = meta.branches?.[courseObj.id] || []
                setBranchOptions(branches)
            } else {
                setYearOptions([])
                setBranchOptions([])
            }
        }
        loadCourseDetails()
    }, [formData.course, formData.collegeId, courseOptions])

    // Update semester options when year changes
    useEffect(() => {
        if (formData.year) {
            setSemesterOptions(getSemesterOptions(parseInt(formData.year)))
        } else {
            setSemesterOptions([])
        }
    }, [formData.year])

    const handleCollegeSelect = (college) => {
        if (college) {
            setFormData(prev => ({
                ...prev,
                collegeId: college.id,
                collegeName: college.name,
                course: '',
                branch: '',
                year: '',
                semester: ''
            }))
        } else {
            // Cleared
            setFormData(prev => ({
                ...prev,
                collegeId: '',
                collegeName: '',
                course: '',
                branch: '',
                year: '',
                semester: ''
            }))
        }
    }

    const handleManualEntry = (name) => {
        setFormData(prev => ({
            ...prev,
            collegeId: '', // No ID for manual entry
            collegeName: name,
            course: '',
            branch: '',
            year: '',
            semester: ''
        }))
        // Load default options for manual entry
        const loadDefaultAndSet = async () => {
            const meta = await getCollegeMeta('_default')
            setCourseOptions(meta.degrees)
        }
        loadDefaultAndSet()
    }

    const handleCourseChange = (e) => {
        setFormData(prev => ({
            ...prev,
            course: e.target.value,
            branch: '',
            year: '',
            semester: ''
        }))
    }

    const handleBranchChange = (e) => {
        setFormData(prev => ({
            ...prev,
            branch: e.target.value
        }))
    }

    const handleAddSubject = () => {
        const subject = prompt('Enter subject name:')
        if (subject && subject.trim()) {
            setFormData(prev => ({
                ...prev,
                subjects: [...prev.subjects, subject.trim()]
            }))
        }
    }

    const handleRemoveSubject = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.filter((_, index) => index !== indexToRemove)
        }))
    }

    const handleYearChange = (e) => {
        setFormData(prev => ({
            ...prev,
            year: e.target.value,
            semester: ''
        }))
    }
    const handleImageUpdate = (newAvatarUrl) => {
        updateUser({ avatar: newAvatarUrl })
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
                                    <img src={user.avatar} alt={user?.name} className="avatar-img" />
                                ) : (
                                    (user?.name || user?.fullName)?.charAt(0).toUpperCase() || 'S'
                                )}
                            </div>
                        )}
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
                                <h2 className="profile-name">{user?.name || user?.fullName || 'Student'}</h2>
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
                        <div className="detail-group full">
                            <label>Education Level</label>
                            {isEditing ? (
                                <div className="education-type-selector">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="educationType"
                                            value="school"
                                            checked={formData.educationType === 'school'}
                                            onChange={handleChange}
                                        />
                                        School
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="educationType"
                                            value="college"
                                            checked={formData.educationType === 'college'}
                                            onChange={handleChange}
                                        />
                                        College
                                    </label>
                                </div>
                            ) : (
                                <span className="capitalize">{formData.educationType || 'Not specified'}</span>
                            )}
                        </div>

                        {formData.educationType === 'school' && (
                            <>
                                <div className="detail-group">
                                    <label>School Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="schoolName"
                                            value={formData.schoolName}
                                            onChange={handleChange}
                                            className="edit-input"
                                            placeholder="Enter school name"
                                        />
                                    ) : (
                                        <span>{formData.schoolName || 'Not set'}</span>
                                    )}
                                </div>
                                <div className="detail-group">
                                    <label>Class/Grade</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="grade"
                                            value={formData.grade}
                                            onChange={handleChange}
                                            className="edit-input"
                                            placeholder="e.g. Class 10"
                                        />
                                    ) : (
                                        <span>{formData.grade || 'Not set'}</span>
                                    )}
                                </div>
                            </>
                        )}

                        {formData.educationType === 'college' && (
                            <>
                                <div className="detail-group full">
                                    <label>College Name</label>
                                    {isEditing ? (
                                        <CollegeAutocomplete
                                            value={formData.collegeName}
                                            selectedCollege={formData.collegeId ? { id: formData.collegeId, name: formData.collegeName } : null}
                                            onSelect={handleCollegeSelect}
                                            onManualEntry={handleManualEntry}
                                            error={!formData.collegeName && false}
                                        />
                                    ) : (
                                        <span>{formData.collegeName || 'Not set'}</span>
                                    )}
                                </div>
                                <div className="detail-group">
                                    <label>Course</label>
                                    {isEditing ? (
                                        <select
                                            name="course"
                                            value={formData.course}
                                            onChange={handleCourseChange}
                                            className="edit-input"
                                        >
                                            <option value="">Select Course</option>
                                            {courseOptions.map(opt => (
                                                <option key={opt.id} value={opt.name}>{opt.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>{formData.course || 'Not set'}</span>
                                    )}
                                </div>

                                {branchOptions.length > 0 && (
                                    <div className="detail-group">
                                        <label>Branch/Stream</label>
                                        {isEditing ? (
                                            <select
                                                name="branch"
                                                value={formData.branch}
                                                onChange={handleBranchChange}
                                                className="edit-input"
                                            >
                                                <option value="">Select Branch</option>
                                                {branchOptions.map(opt => (
                                                    <option key={opt.id} value={opt.name}>{opt.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span>{formData.branch || 'Not set'}</span>
                                        )}
                                    </div>
                                )}

                                <div className="detail-group">
                                    <label>Year</label>
                                    {isEditing ? (
                                        <select
                                            name="year"
                                            value={formData.year}
                                            onChange={handleYearChange}
                                            className="edit-input"
                                            disabled={!formData.course}
                                        >
                                            <option value="">Select Year</option>
                                            {yearOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>{formData.year ? `${formData.year}${formData.year === '1' ? 'st' : formData.year === '2' ? 'nd' : formData.year === '3' ? 'rd' : 'th'} Year` : 'Not set'}</span>
                                    )}
                                </div>
                                <div className="detail-group">
                                    <label>Semester</label>
                                    {isEditing ? (
                                        <select
                                            name="semester"
                                            value={formData.semester}
                                            onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                                            className="edit-input"
                                            disabled={!formData.year}
                                        >
                                            <option value="">Select Semester</option>
                                            {semesterOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>{formData.semester ? `${formData.semester}${getOrdinalSuffix(formData.semester)} Sem` : 'Not set'}</span>
                                    )}
                                </div>
                            </>
                        )}
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
                                <span key={i} className="subject-tag">
                                    {subject}
                                    {isEditing && (
                                        <button
                                            className="remove-subject-btn"
                                            onClick={() => handleRemoveSubject(i)}
                                            aria-label="Remove subject"
                                        >
                                            ×
                                        </button>
                                    )}
                                </span>
                            ))}
                            {isEditing && (
                                <button
                                    className="add-subject-btn"
                                    onClick={handleAddSubject}
                                >
                                    + Add
                                </button>
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
