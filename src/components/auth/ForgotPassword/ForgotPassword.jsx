/* ==============================
   Forgot Password Component
   Password reset flow with email input, OTP verification,
   and new password creation for account recovery
   ============================== */
import { useState } from 'react'
import { useToast } from '../../../App'
import './ForgotPassword.css'

const ForgotPassword = ({ onBack }) => {
    const { showToast } = useToast()
    const [step, setStep] = useState(1) // 1: email, 2: otp, 3: new password
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleEmailSubmit = (e) => {
        e.preventDefault()
        if (!email) return

        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            setStep(2)
            showToast('OTP sent to your email!', 'success')
        }, 1500)
    }

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleOtpSubmit = (e) => {
        e.preventDefault()
        const otpValue = otp.join('')
        if (otpValue.length !== 6) {
            showToast('Please enter complete OTP', 'error')
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            setStep(3)
            showToast('OTP verified!', 'success')
        }, 1500)
    }

    const handlePasswordSubmit = (e) => {
        e.preventDefault()
        if (newPassword.length < 8) {
            showToast('Password must be at least 8 characters', 'error')
            return
        }
        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error')
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            showToast('Password reset successful!', 'success')
            onBack?.()
        }, 1500)
    }

    return (
        <div className="forgot-password">
            <button className="back-btn" onClick={onBack}>
                ← Back to Login
            </button>

            <div className="forgot-header">
                <h2>Reset Password</h2>
                <p>
                    {step === 1 && "Enter your email to receive a verification code"}
                    {step === 2 && "Enter the 6-digit code sent to your email"}
                    {step === 3 && "Create a new secure password"}
                </p>
            </div>

            {/* Progress Steps */}
            <div className="reset-steps">
                <div className={`reset-step ${step >= 1 ? 'active' : ''}`}>
                    <span className="step-num">1</span>
                    <span className="step-label">Email</span>
                </div>
                <div className="step-line"></div>
                <div className={`reset-step ${step >= 2 ? 'active' : ''}`}>
                    <span className="step-num">2</span>
                    <span className="step-label">Verify</span>
                </div>
                <div className="step-line"></div>
                <div className={`reset-step ${step >= 3 ? 'active' : ''}`}>
                    <span className="step-num">3</span>
                    <span className="step-label">Reset</span>
                </div>
            </div>

            {/* Step 1: Email */}
            {step === 1 && (
                <form onSubmit={handleEmailSubmit} className="reset-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="reset-form">
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                className="otp-input"
                            />
                        ))}
                    </div>
                    <p className="resend-text">
                        Didn't receive code? <button type="button" className="resend-btn">Resend</button>
                    </p>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
                <form onSubmit={handlePasswordSubmit} className="reset-form">
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            )}
        </div>
    )
}

export default ForgotPassword
