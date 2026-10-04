/* ==============================
   Auth Modal Component - Login/Signup Dialog
   Full authentication UI with email/password login, multi-step signup
   (student/tutor), Google and GitHub OAuth, role selection, and form validation
   ============================== */
import { useState, useEffect, useRef, useCallback } from 'react'
import { authService } from '../../../services/authService'
import { getCollegeMeta, getYearOptions, getSemesterOptions, emitTelemetry } from '../../../services/collegeService'
import { useAuth, useToast } from '../../../App'
import CollegeAutocomplete from '../CollegeAutocomplete/CollegeAutocomplete'
import './AuthModal.css'

const AuthModal = ({ isOpen, onClose, mode, setMode }) => {
    const { login, signup } = useAuth()
    const { showToast } = useToast()
    const modalRef = useRef(null)

    // Form state
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    // Password Visibility State
    const [showPassword, setShowPassword] = useState(false)

    // Role Selection for new Google users
    const [showRoleSelection, setShowRoleSelection] = useState(false)
    const [pendingGoogleUser, setPendingGoogleUser] = useState(null)

    // Common fields
    const [formData, setFormData] = useState({
        // Step 1 - Basic
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student', // 'student' or 'tutor'

        // Step 2 - Student specific
        educationType: 'school', // 'school' or 'college'
        schoolName: '',
        className: '',
        // College fields (new)
        college_id: null,
        collegeName: '',
        collegeManualName: '',
        needs_review: false,
        degree: '',
        branch: '',
        year: '',
        semester: '',

        // Step 2 - Tutor specific
        subjects: [],
        teachingStyle: '',
        experience: '',

        // Step 3 - Common
        bio: '',
        languages: [],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
    })

    // Load draft from localStorage
    useEffect(() => {
        const draft = localStorage.getItem('guru-connect-signup-draft')
        if (draft) {
            try {
                const parsed = JSON.parse(draft)
                setFormData(prev => ({ ...prev, ...parsed }))
            } catch (e) {
                // Invalid draft, ignore
            }
        }
    }, [])

    // Save draft to localStorage
    useEffect(() => {
        if (mode === 'signup' && step > 1) {
            const timeoutId = setTimeout(() => {
                localStorage.setItem('guru-connect-signup-draft', JSON.stringify(formData))
            }, 500)
            return () => clearTimeout(timeoutId)
        }
    }, [formData, step, mode])

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    // Reset form when modal closes or mode changes
    useEffect(() => {
        if (!isOpen) {
            setStep(1)
            setErrors({})
            setShowPassword(false)
        }
    }, [isOpen])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleMultiSelect = (name, value) => {
        setFormData(prev => {
            const current = prev[name] || []
            if (current.includes(value)) {
                return { ...prev, [name]: current.filter(v => v !== value) }
            } else {
                return { ...prev, [name]: [...current, value] }
            }
        })
    }

    // ============================================
    // COLLEGE AUTOCOMPLETE STATE & HANDLERS
    // ============================================
    const [selectedCollege, setSelectedCollege] = useState(null)
    const [collegeMeta, setCollegeMeta] = useState(null)
    const [degreeOptions, setDegreeOptions] = useState([])
    const [branchOptions, setBranchOptions] = useState([])
    const [yearOptions, setYearOptions] = useState([])
    const [semesterOptions, setSemesterOptions] = useState([])
    const [collegeMetaLoading, setCollegeMetaLoading] = useState(false)
    const [cascadeNotice, setCascadeNotice] = useState('')

    // Handle college selection from autocomplete
    const handleCollegeSelect = useCallback(async (college, displayName) => {
        if (!college) {
            // User is typing after previously selecting
            setSelectedCollege(null)
            setFormData(prev => ({
                ...prev,
                college_id: null,
                collegeName: '',
                needs_review: false
            }))
            return
        }

        setSelectedCollege(college)
        setFormData(prev => ({
            ...prev,
            college_id: college.id,
            collegeName: displayName,
            collegeManualName: '',
            needs_review: false,
            // Reset downstream fields
            degree: '',
            branch: '',
            year: '',
            semester: ''
        }))

        // Show cascade notice if previous selections existed
        if (formData.degree || formData.branch) {
            setCascadeNotice('College changed — please re-select degree & branch.')
            setTimeout(() => setCascadeNotice(''), 5000)
        }

        // Fetch college metadata
        setCollegeMetaLoading(true)
        try {
            const meta = await getCollegeMeta(college.id)
            setCollegeMeta(meta)
            setDegreeOptions(meta.degrees || [])
            setBranchOptions([])
            setYearOptions([])
            setSemesterOptions([])
        } catch (err) {
            console.error('Failed to fetch college meta:', err)
            // Use default options on error
            const defaultMeta = await getCollegeMeta('_default')
            setCollegeMeta(defaultMeta)
            setDegreeOptions(defaultMeta.degrees || [])
        } finally {
            setCollegeMetaLoading(false)
        }
    }, [formData.degree, formData.branch])

    // Handle manual college entry
    const handleManualCollegeEntry = useCallback((name) => {
        setSelectedCollege(null)
        setFormData(prev => ({
            ...prev,
            college_id: null,
            collegeName: name,
            collegeManualName: name,
            needs_review: true,
            degree: '',
            branch: '',
            year: '',
            semester: ''
        }))

        // Load default options for manual entry
        getCollegeMeta('_default').then(meta => {
            setCollegeMeta(meta)
            setDegreeOptions(meta.degrees || [])
            setBranchOptions([])
            setYearOptions([])
            setSemesterOptions([])
        })
    }, [])

    // Handle degree change
    const handleDegreeChange = useCallback((e) => {
        const degreeId = e.target.value
        const degree = degreeOptions.find(d => d.id === degreeId)

        // Show cascade notice if branch was previously set
        if (formData.branch) {
            setCascadeNotice('Degree changed — please re-select branch.')
            setTimeout(() => setCascadeNotice(''), 5000)
        }

        setFormData(prev => ({
            ...prev,
            degree: degreeId,
            branch: '',
            year: '',
            semester: ''
        }))

        if (collegeMeta && degreeId) {
            setBranchOptions(collegeMeta.branches[degreeId] || [])
            setYearOptions(degree ? getYearOptions(degree.duration) : [])
            setSemesterOptions([])

            emitTelemetry('degree_selected', { degreeId })
        } else {
            setBranchOptions([])
            setYearOptions([])
            setSemesterOptions([])
        }
    }, [degreeOptions, collegeMeta, formData.branch])

    // Handle branch change
    const handleBranchChange = useCallback((e) => {
        const branchId = e.target.value
        setFormData(prev => ({
            ...prev,
            branch: branchId
        }))
    }, [])

    // Handle year change
    const handleYearChange = useCallback((e) => {
        const year = e.target.value
        setFormData(prev => ({
            ...prev,
            year,
            semester: ''
        }))

        if (year) {
            setSemesterOptions(getSemesterOptions(parseInt(year)))
        } else {
            setSemesterOptions([])
        }
    }, [])

    // Handle semester change
    const handleSemesterChange = useCallback((e) => {
        setFormData(prev => ({
            ...prev,
            semester: e.target.value
        }))
    }, [])


    const validateStep = (stepNum) => {
        const newErrors = {}

        if (stepNum === 1) {
            if (!formData.fullName.trim()) {
                newErrors.fullName = 'Full name is required'
            }
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required'
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email'
            }
            if (mode === 'signup') {
                if (!formData.password) {
                    newErrors.password = 'Password is required'
                } else if (formData.password.length < 8) {
                    newErrors.password = 'Password must be at least 8 characters'
                } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
                    newErrors.password = 'Password must contain at least 1 letter and 1 number'
                }
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match'
                }
            }
        }

        if (stepNum === 2) {
            if (formData.role === 'student') {
                if (formData.educationType === 'school') {
                    if (!formData.schoolName.trim()) {
                        newErrors.schoolName = 'School name is required'
                    }
                    if (!formData.className.trim()) {
                        newErrors.className = 'Class is required'
                    }
                } else {
                    // College validation
                    if (!formData.college_id && !formData.collegeManualName.trim()) {
                        newErrors.collegeName = 'Please select or enter a college'
                    }
                    if (!formData.degree) {
                        newErrors.degree = 'Degree is required'
                    }
                    if (!formData.branch) {
                        newErrors.branch = 'Branch is required'
                    }
                    if (!formData.year) {
                        newErrors.year = 'Year is required'
                    }
                    if (!formData.semester) {
                        newErrors.semester = 'Semester is required'
                    }
                }
            } else {
                if (formData.subjects.length === 0) {
                    newErrors.subjects = 'Please select at least one subject'
                }
                if (!formData.teachingStyle.trim()) {
                    newErrors.teachingStyle = 'Teaching style is required'
                }
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1)
        }
    }

    const handleBack = () => {
        setStep(step - 1)
    }

    // Google Sign-In Handler
    const handleGoogleSignIn = async () => {
        try {
            // First authenticate with Google (pass null to skip role assignment for new users)
            const user = await authService.googleSignIn(null)
            setIsLoading(true)

            if (user.isNewUser) {
                // New user - show role selection modal
                setPendingGoogleUser(user)
                setShowRoleSelection(true)
            } else {
                // Existing user - login directly
                login(user)
            }
        } catch (error) {
            if (error.message !== 'Sign-in cancelled') {
                setErrors({ email: error.message || 'Google sign-in failed' })
            }
        } finally {
            setIsLoading(false)
        }
    }

    // GitHub Sign-In Handler
    const handleGithubSignIn = async () => {
        try {
            // Authenticate with GitHub
            const user = await authService.githubSignIn(null)
            setIsLoading(true)

            if (user.isNewUser) {
                // New user - show role selection modal
                setPendingGoogleUser(user)
                setShowRoleSelection(true)
            } else {
                // Existing user - login directly
                login(user)
            }
        } catch (error) {
            if (error.message !== 'Sign-in cancelled') {
                setErrors({ email: error.message || 'GitHub sign-in failed' })
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Handle role selection for new Google users
    const handleRoleSelect = async (selectedRole) => {
        if (!pendingGoogleUser) return

        setIsLoading(true)
        try {
            // Update user's role in Firestore
            await authService.updateUser(pendingGoogleUser.id, { role: selectedRole })

            // Update local user object and login
            const updatedUser = { ...pendingGoogleUser, role: selectedRole }
            showToast(`Welcome to GuruConnect as a ${selectedRole === 'tutor' ? 'Tutor' : 'Student'}!`, 'success')
            login(updatedUser)

            // Clean up
            setShowRoleSelection(false)
            setPendingGoogleUser(null)
        } catch (error) {
            setErrors({ email: error.message || 'Failed to set role' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        const newErrors = {}
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        }
        if (!formData.password) {
            newErrors.password = 'Password is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsLoading(true)

        try {
            const user = await authService.login(formData.email, formData.password)
            login(user)
        } catch (error) {
            setErrors({ email: error.message || 'Login failed' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault()

        if (!validateStep(step)) return

        setIsLoading(true)

        try {
            const newUser = await authService.signup(formData)

            // Clear draft on successful signup
            localStorage.removeItem('guru-connect-signup-draft')

            signup(newUser)
        } catch (error) {
            // Change step to 1 to show the email error if we are on step 2 or 3
            if (step > 1) {
                setStep(1)
            }
            
            // Check if it's a duplicate email error
            if (error.message && error.message.toLowerCase().includes('already exists')) {
                showToast('Email already exists. Please try logging in.', 'error')
                setErrors({
                    email: 'An account with this email already exists. Please try logging in instead.',
                    isDuplicate: true
                })
                // Auto-scroll to show error
                setTimeout(() => {
                    const emailInput = document.querySelector('input[name="email"]')
                    emailInput?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 100)
            } else {
                showToast(error.message || 'Signup failed', 'error')
                setErrors({ email: error.message || 'Signup failed' })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const getTotalSteps = () => {
        return 3
    }

    const subjectOptions = [
        'Mathematics', 'Physics', 'Chemistry', 'Biology',
        'English', 'Hindi', 'History', 'Geography',
        'Computer Science', 'Economics', 'Accounting', 'Business Studies'
    ]

    const languageOptions = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati']

    const timezoneOptions = [
        'Asia/Kolkata',
        'Asia/Dubai',
        'Europe/London',
        'America/New_York',
        'America/Los_Angeles',
        'Asia/Singapore',
        'Australia/Sydney'
    ]

    if (!isOpen) return null

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div
                className="auth-modal"
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-modal-title"
            >
                {/* Close Button */}
                <button className="auth-close" onClick={onClose} aria-label="Close modal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Header */}
                <div className="auth-header">
                    <div className="auth-logo">
                        <img src="/guruconnect-logo.png" alt="Guru Connect" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                    </div>
                    <h2 id="auth-modal-title" className="auth-title">
                        {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
                    </h2>
                    <p className="auth-subtitle">
                        {mode === 'login'
                            ? 'Sign in to continue your learning journey'
                            : 'Join thousands of learners on Guru Connect'}
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="auth-toggle">
                    <button
                        className={`toggle-btn ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => { setMode('login'); setStep(1); setErrors({}); }}
                    >
                        Login
                    </button>
                    <button
                        className={`toggle-btn ${mode === 'signup' ? 'active' : ''}`}
                        onClick={() => { setMode('signup'); setStep(1); setErrors({}); }}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Step Indicator (Signup only) */}
                {mode === 'signup' && (
                    <div className="step-indicator">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`step ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}>
                                <div className="step-circle">
                                    {s < step ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20,6 9,17 4,12" />
                                        </svg>
                                    ) : s}
                                </div>
                                <span className="step-label">
                                    {s === 1 ? 'Basics' : s === 2 ? 'Details' : 'Preferences'}
                                </span>
                            </div>
                        ))}
                        <div className="step-line">
                            <div className="step-progress" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
                        </div>
                    </div>
                )}

                {/* Form Content */}
                <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="auth-form">

                    {/* LOGIN FORM */}
                    {mode === 'login' && (
                        <div className="form-step">
                            <div className="input-group">
                                <label htmlFor="login-email" className="input-label">Email</label>
                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    className={`input ${errors.email ? 'input-error' : ''}`}
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    autoComplete="email"
                                />
                                {errors.email && <span className="input-error-text">{errors.email}</span>}
                            </div>

                            <div className="input-group">
                                <label htmlFor="login-password" className="input-label">Password</label>
                                <div className="input-password">
                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className={`input ${errors.password ? 'input-error' : ''}`}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <span className="input-error-text">{errors.password}</span>}
                            </div>

                            <div className="form-footer-row">
                                <label className="checkbox-label">
                                    <input type="checkbox" /> Remember me
                                </label>
                                <button type="button" className="link-btn">Forgot Password?</button>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={isLoading}>
                                {isLoading ? <span className="spinner"></span> : 'Sign In'}
                            </button>


                        </div>
                    )}

                    {/* SIGNUP STEP 1 */}
                    {mode === 'signup' && step === 1 && (
                        <div className="form-step">
                            <div className="input-group">
                                <label htmlFor="fullName" className="input-label">Full Name</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    className={`input ${errors.fullName ? 'input-error' : ''}`}
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    autoComplete="name"
                                />
                                {errors.fullName && <span className="input-error-text">{errors.fullName}</span>}
                            </div>

                            <div className="input-group">
                                <label htmlFor="signup-email" className="input-label">Email</label>
                                <input
                                    id="signup-email"
                                    type="email"
                                    name="email"
                                    className={`input ${errors.email ? 'input-error' : ''}`}
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <span className="input-error-text">
                                        {errors.email}
                                        {errors.isDuplicate && (
                                            <>
                                                {' '}
                                                <button
                                                    type="button"
                                                    className="link-btn"
                                                    onClick={() => {
                                                        setMode('login')
                                                        setStep(1)
                                                        setErrors({})
                                                    }}
                                                    style={{ fontSize: 'inherit', textDecoration: 'underline' }}
                                                >
                                                    Switch to Login
                                                </button>
                                            </>
                                        )}
                                    </span>
                                )}
                            </div>

                            <div className="input-group">
                                <label htmlFor="signup-password" className="input-label">Password</label>
                                <div className="input-password">
                                    <input
                                        id="signup-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className={`input ${errors.password ? 'input-error' : ''}`}
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <span className="input-error-text">{errors.password}</span>}
                                <span className="input-helper">Min 8 characters, at least 1 letter and 1 number</span>
                            </div>

                            <div className="input-group">
                                <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                                <div className="input-password">
                                    <input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        autoComplete="new-password"
                                    />
                                    {/* No toggle button for confirm password to keep it clean, but could add if requested */}
                                </div>
                                {errors.confirmPassword && <span className="input-error-text">{errors.confirmPassword}</span>}
                            </div>

                            {/* Role Selection */}
                            <div className="input-group">
                                <label className="input-label">I am a</label>
                                <div className="role-selector">
                                    <button
                                        type="button"
                                        className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                                    >
                                        <span className="role-icon">
                                            <img src="/assets/icons/role.png" alt="Student" width="32" height="32" />
                                        </span>
                                        <span className="role-text">Student</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`role-btn ${formData.role === 'tutor' ? 'active' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, role: 'tutor' }))}
                                    >
                                        <span className="role-icon">
                                            <img src="/assets/icons/tutor-role.png" alt="Tutor" width="32" height="32" />
                                        </span>
                                        <span className="role-text">Tutor</span>
                                    </button>
                                </div>
                            </div>

                            <button type="button" className="btn btn-primary btn-lg submit-btn" onClick={handleNext}>
                                Continue
                            </button>
                        </div>
                    )}

                    {/* SIGNUP STEP 2 - STUDENT */}
                    {mode === 'signup' && step === 2 && formData.role === 'student' && (
                        <div className="form-step">
                            <div className="input-group">
                                <label className="input-label">Education Type</label>
                                <div className="education-selector">
                                    <button
                                        type="button"
                                        className={`edu-btn ${formData.educationType === 'school' ? 'active' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, educationType: 'school' }))}
                                    >
                                        <span>🏫</span> School Student
                                    </button>
                                    <button
                                        type="button"
                                        className={`edu-btn ${formData.educationType === 'college' ? 'active' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, educationType: 'college' }))}
                                    >
                                        <span>🎓</span> College Student
                                    </button>
                                </div>
                            </div>

                            {formData.educationType === 'school' ? (
                                <>
                                    <div className="input-group">
                                        <label htmlFor="schoolName" className="input-label">School Name</label>
                                        <input
                                            id="schoolName"
                                            type="text"
                                            name="schoolName"
                                            className={`input ${errors.schoolName ? 'input-error' : ''}`}
                                            placeholder="Enter your school name"
                                            value={formData.schoolName}
                                            onChange={handleInputChange}
                                        />
                                        {errors.schoolName && <span className="input-error-text">{errors.schoolName}</span>}
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="className" className="input-label">Class</label>
                                        <select
                                            id="className"
                                            name="className"
                                            className={`input ${errors.className ? 'input-error' : ''}`}
                                            value={formData.className}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select your class</option>
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i + 1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                                            ))}
                                        </select>
                                        {errors.className && <span className="input-error-text">{errors.className}</span>}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Cascade Reset Notice */}
                                    {cascadeNotice && (
                                        <div className="cascade-notice" role="alert">
                                            <span>⚠️</span> {cascadeNotice}
                                        </div>
                                    )}

                                    {/* College Autocomplete */}
                                    <div className="input-group">
                                        <label htmlFor="collegeName" className="input-label">College Name</label>
                                        <CollegeAutocomplete
                                            value={formData.collegeName}
                                            selectedCollege={selectedCollege}
                                            onSelect={handleCollegeSelect}
                                            onManualEntry={handleManualCollegeEntry}
                                            error={errors.collegeName}
                                        />
                                        {errors.collegeName && <span className="input-error-text">{errors.collegeName}</span>}
                                        {formData.needs_review && (
                                            <span className="input-helper input-helper-warning">
                                                ⚠️ Manual entry - will be reviewed by admin
                                            </span>
                                        )}
                                    </div>

                                    {/* Degree Select */}
                                    <div className="input-group">
                                        <label htmlFor="degree" className="input-label">Degree</label>
                                        <select
                                            id="degree"
                                            name="degree"
                                            className={`input ${errors.degree ? 'input-error' : ''}`}
                                            value={formData.degree}
                                            onChange={handleDegreeChange}
                                            disabled={!formData.collegeName || collegeMetaLoading}
                                            aria-describedby={!formData.collegeName ? 'degree-hint' : undefined}
                                        >
                                            <option value="">
                                                {collegeMetaLoading ? 'Loading...' : 'Select degree'}
                                            </option>
                                            {degreeOptions.map(deg => (
                                                <option key={deg.id} value={deg.id}>{deg.name}</option>
                                            ))}
                                        </select>
                                        {!formData.collegeName && (
                                            <span id="degree-hint" className="input-helper">Select a college first</span>
                                        )}
                                        {errors.degree && <span className="input-error-text">{errors.degree}</span>}
                                    </div>

                                    {/* Branch Select */}
                                    <div className="input-group">
                                        <label htmlFor="branch" className="input-label">Branch / Specialization</label>
                                        <select
                                            id="branch"
                                            name="branch"
                                            className={`input ${errors.branch ? 'input-error' : ''}`}
                                            value={formData.branch}
                                            onChange={handleBranchChange}
                                            disabled={!formData.degree}
                                            aria-describedby={!formData.degree ? 'branch-hint' : undefined}
                                        >
                                            <option value="">Select branch</option>
                                            {branchOptions.map(b => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                        {!formData.degree && (
                                            <span id="branch-hint" className="input-helper">Select a degree first</span>
                                        )}
                                        {errors.branch && <span className="input-error-text">{errors.branch}</span>}
                                    </div>

                                    {/* Year & Semester Row */}
                                    <div className="input-row">
                                        <div className="input-group">
                                            <label htmlFor="year" className="input-label">Year</label>
                                            <select
                                                id="year"
                                                name="year"
                                                className={`input ${errors.year ? 'input-error' : ''}`}
                                                value={formData.year}
                                                onChange={handleYearChange}
                                                disabled={!formData.branch}
                                            >
                                                <option value="">Select year</option>
                                                {yearOptions.map(y => (
                                                    <option key={y.value} value={y.value}>{y.label}</option>
                                                ))}
                                            </select>
                                            {errors.year && <span className="input-error-text">{errors.year}</span>}
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="semester" className="input-label">Semester</label>
                                            <select
                                                id="semester"
                                                name="semester"
                                                className={`input ${errors.semester ? 'input-error' : ''}`}
                                                value={formData.semester}
                                                onChange={handleSemesterChange}
                                                disabled={!formData.year}
                                            >
                                                <option value="">Select semester</option>
                                                {semesterOptions.map(s => (
                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                ))}
                                            </select>
                                            {errors.semester && <span className="input-error-text">{errors.semester}</span>}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleBack}>
                                    Back
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleNext}>
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SIGNUP STEP 2 - TUTOR */}
                    {mode === 'signup' && step === 2 && formData.role === 'tutor' && (
                        <div className="form-step">
                            <div className="input-group">
                                <label className="input-label">Subjects You Teach</label>
                                <div className="tag-selector">
                                    {subjectOptions.map(subject => (
                                        <button
                                            key={subject}
                                            type="button"
                                            className={`tag-btn ${formData.subjects.includes(subject) ? 'active' : ''}`}
                                            onClick={() => handleMultiSelect('subjects', subject)}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                                {errors.subjects && <span className="input-error-text">{errors.subjects}</span>}
                            </div>

                            <div className="input-group">
                                <label htmlFor="teachingStyle" className="input-label">Teaching Style</label>
                                <textarea
                                    id="teachingStyle"
                                    name="teachingStyle"
                                    className={`input textarea ${errors.teachingStyle ? 'input-error' : ''}`}
                                    placeholder="Describe your teaching approach..."
                                    value={formData.teachingStyle}
                                    onChange={handleInputChange}
                                    rows={3}
                                />
                                {errors.teachingStyle && <span className="input-error-text">{errors.teachingStyle}</span>}
                            </div>

                            <div className="input-group">
                                <label htmlFor="experience" className="input-label">Experience (Optional)</label>
                                <select
                                    id="experience"
                                    name="experience"
                                    className="input"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select experience</option>
                                    <option value="0-1">Less than 1 year</option>
                                    <option value="1-3">1-3 years</option>
                                    <option value="3-5">3-5 years</option>
                                    <option value="5-10">5-10 years</option>
                                    <option value="10+">10+ years</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleBack}>
                                    Back
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleNext}>
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SIGNUP STEP 3 - PREFERENCES */}
                    {mode === 'signup' && step === 3 && (
                        <div className="form-step">
                            <div className="input-group">
                                <label htmlFor="bio" className="input-label">Bio (Optional)</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    className="input textarea"
                                    placeholder="Tell us a bit about yourself..."
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    rows={3}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Preferred Languages</label>
                                <div className="tag-selector">
                                    {languageOptions.map(lang => (
                                        <button
                                            key={lang}
                                            type="button"
                                            className={`tag-btn ${formData.languages.includes(lang) ? 'active' : ''}`}
                                            onClick={() => handleMultiSelect('languages', lang)}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="timezone" className="input-label">Timezone</label>
                                <select
                                    id="timezone"
                                    name="timezone"
                                    className="input"
                                    value={formData.timezone}
                                    onChange={handleInputChange}
                                >
                                    {timezoneOptions.map(tz => (
                                        <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                                    ))}
                                </select>
                                <span className="input-helper">Auto-detected from your browser</span>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleBack}>
                                    Back
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                    {isLoading ? <span className="spinner"></span> : 'Create Account'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Social Divider */}
                <div className="auth-divider">
                    <span>or continue with</span>
                </div>

                {/* Social Login */}
                <div className="social-login">
                    <button
                        type="button"
                        className="social-btn"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                    <button
                        type="button"
                        className="social-btn"
                        onClick={handleGithubSignIn}
                        disabled={isLoading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                    </button>
                </div>

                {/* Terms */}
                <p className="auth-terms">
                    By continuing, you agree to our{' '}
                    <a href="#">Terms of Service</a> and{' '}
                    <a href="#">Privacy Policy</a>
                </p>

                {/* Role Selection Modal for New Google Users */}
                {showRoleSelection && (
                    <div className="role-selection-overlay">
                        <div className="role-selection-modal">
                            <div className="role-modal-header">
                                <span className="role-modal-icon">🎯</span>
                                <h3>Welcome to GuruConnect!</h3>
                                <p>How do you want to use the platform?</p>
                            </div>
                            <div className="role-selection-options">
                                <button
                                    className="role-option-btn student-option"
                                    onClick={() => handleRoleSelect('student')}
                                    disabled={isLoading}
                                >
                                    <span className="role-option-icon">
                                        <img src="/assets/icons/role.png" alt="Student" width="48" height="48" />
                                    </span>
                                    <span className="role-option-title">I'm a Student</span>
                                    <span className="role-option-desc">Find tutors, book sessions, learn new skills</span>
                                </button>
                                <button
                                    className="role-option-btn tutor-option"
                                    onClick={() => handleRoleSelect('tutor')}
                                    disabled={isLoading}
                                >
                                    <span className="role-option-icon">
                                        <img src="/assets/icons/tutor-role.png" alt="Tutor" width="48" height="48" />
                                    </span>
                                    <span className="role-option-title">I'm a Tutor</span>
                                    <span className="role-option-desc">Teach students, earn money, share knowledge</span>
                                </button>
                            </div>
                            {isLoading && (
                                <div className="role-loading">
                                    <span className="spinner"></span>
                                    <span>Setting up your account...</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AuthModal
