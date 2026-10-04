/* ==============================
   Profile Completion Banner Component
   Dismissible banner for incomplete profiles, shows completion percentage,
   missing fields, progress ring, and Complete Now CTA with 3-day dismiss cooldown
   ============================== */
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../../App'
import './ProfileCompletionBanner.css'

/**
 * ProfileCompletionBanner
 * Shows a dismissible banner for users with incomplete profiles (especially Google signups)
 * Calculates completion % and shows what's missing
 */
const ProfileCompletionBanner = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(true)

    if (!user || !isVisible) return null

    // Calculate profile completion
    const getCompletionStatus = () => {
        const requiredFields = {
            common: ['bio', 'languages'],
            student: ['educationType', 'schoolName', 'collegeName'],
            tutor: ['subjects', 'teachingStyle', 'experience', 'hourlyRate']
        }

        const fields = [...requiredFields.common]
        if (user.role === 'student') {
            fields.push(...requiredFields.student)
        } else if (user.role === 'tutor') {
            fields.push(...requiredFields.tutor)
        }

        let completedCount = 0
        const missing = []

        fields.forEach(field => {
            const value = user[field]
            if (value && (Array.isArray(value) ? value.length > 0 : value.toString().trim())) {
                completedCount++
            } else {
                missing.push(field)
            }
        })

        const percentage = Math.round((completedCount / fields.length) * 100)
        return { percentage, missing, total: fields.length, completed: completedCount }
    }

    const status = getCompletionStatus()

    // Don't show if profile is 80%+ complete
    if (status.percentage >= 80) return null

    // Check if user dismissed recently (stored in localStorage)
    const dismissKey = `profile-banner-dismissed-${user.id}`
    const dismissedAt = localStorage.getItem(dismissKey)
    if (dismissedAt) {
        const daysSinceDismiss = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24)
        if (daysSinceDismiss < 3) return null // Don't show for 3 days after dismiss
    }

    const handleDismiss = () => {
        localStorage.setItem(dismissKey, Date.now().toString())
        setIsVisible(false)
    }

    const handleComplete = () => {
        navigate(user.role === 'tutor' ? '/tutor/profile' : '/student/profile')
    }

    // Friendly field names
    const fieldNames = {
        bio: 'Bio',
        languages: 'Languages',
        educationType: 'Education Type',
        schoolName: 'School/College',
        collegeName: 'College',
        subjects: 'Teaching Subjects',
        teachingStyle: 'Teaching Style',
        experience: 'Experience',
        hourlyRate: 'Hourly Rate'
    }

    return (
        <div className="profile-completion-banner">
            <div className="banner-content">
                <div className="banner-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                </div>
                <div className="banner-text">
                    <h4>Complete Your Profile</h4>
                    <p>
                        {status.percentage}% complete • Add {status.missing.slice(0, 2).map(f => fieldNames[f] || f).join(', ')}
                        {status.missing.length > 2 && ` +${status.missing.length - 2} more`}
                    </p>
                </div>
                <div className="banner-progress">
                    <div className="progress-ring">
                        <svg viewBox="0 0 36 36">
                            <path
                                className="progress-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="progress-fill"
                                strokeDasharray={`${status.percentage}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <span className="progress-text">{status.percentage}%</span>
                    </div>
                </div>
            </div>
            <div className="banner-actions">
                <button className="btn btn-sm btn-ghost" onClick={handleDismiss}>
                    Later
                </button>
                <button className="btn btn-sm btn-primary" onClick={handleComplete}>
                    Complete Now
                </button>
            </div>
        </div>
    )
}

export default ProfileCompletionBanner
