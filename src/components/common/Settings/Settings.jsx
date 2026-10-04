/* ==============================
   Settings Component - User Preferences
   Settings page with Appearance (dark mode), Notifications (email/push/SMS),
   Privacy (profile visibility, online status, DMs), and Danger Zone (delete account)
   ============================== */
import { useState } from 'react'
import { useTheme, useAuth, useToast } from '../../../App'
import { authService } from '../../../services/authService'
import './Settings.css'

const Settings = () => {
    const { theme, toggleTheme } = useTheme()
    const { user, updateUser, logout } = useAuth()
    const { showToast } = useToast()

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        marketing: false
    })

    const [privacy, setPrivacy] = useState({
        profileVisible: true,
        showOnline: true,
        allowMessages: true
    })

    // Delete Account Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletePassword, setDeletePassword] = useState('')
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteError, setDeleteError] = useState('')

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
        showToast('Notification settings updated', 'success')
    }

    const handlePrivacyChange = (key) => {
        setPrivacy(prev => ({ ...prev, [key]: !prev[key] }))
        showToast('Privacy settings updated', 'success')
    }

    const handleDeleteAccount = async () => {
        setDeleteLoading(true)
        setDeleteError('')

        try {
            // Check if user logged in with Google (no password needed)
            const currentUser = authService.getCurrentUser()
            const isGoogleUser = currentUser?.providerData[0]?.providerId === 'google.com'

            if (!isGoogleUser && !deletePassword) {
                setDeleteError('Please enter your password to confirm')
                setDeleteLoading(false)
                return
            }

            await authService.deleteAccount(isGoogleUser ? null : deletePassword)
            showToast('Your account has been permanently deleted', 'info')
            logout()
        } catch (error) {
            setDeleteError(error.message)
        } finally {
            setDeleteLoading(false)
        }
    }

    const isGoogleUser = authService.getCurrentUser()?.providerData[0]?.providerId === 'google.com'

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage your account preferences</p>
            </div>

            {/* Appearance */}
            <section className="settings-section">
                <h2 className="section-title">🎨 Appearance</h2>
                <div className="settings-card">
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Dark Mode</span>
                            <span className="setting-desc">Switch between light and dark theme</span>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </section>

            {/* Notifications */}
            <section className="settings-section">
                <h2 className="section-title">🔔 Notifications</h2>
                <div className="settings-card">
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Email Notifications</span>
                            <span className="setting-desc">Receive updates via email</span>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={notifications.email}
                                onChange={() => handleNotificationChange('email')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Push Notifications</span>
                            <span className="setting-desc">Browser push notifications</span>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={notifications.push}
                                onChange={() => handleNotificationChange('push')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">SMS Notifications</span>
                            <span className="setting-desc">Get important alerts via SMS</span>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={notifications.sms}
                                onChange={() => handleNotificationChange('sms')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </section>

            {/* Privacy */}
            <section className="settings-section">
                <h2 className="section-title">🔒 Privacy</h2>
                <div className="settings-card">
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Profile Visibility</span>
                            <span className="setting-desc">Make your profile visible to others</span>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={privacy.profileVisible}
                                onChange={() => handlePrivacyChange('profileVisible')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Show Online Status</span>
                            <span className="setting-desc">Let others see when you're online</span>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={privacy.showOnline}
                                onChange={() => handlePrivacyChange('showOnline')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Allow Direct Messages</span>
                            <span className="setting-desc">Receive messages from tutors/students</span>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={privacy.allowMessages}
                                onChange={() => handlePrivacyChange('allowMessages')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="settings-section danger">
                <h2 className="section-title">⚠️ Danger Zone</h2>
                <div className="settings-card danger">
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Delete Account</span>
                            <span className="setting-desc">Permanently delete your account and all data</span>
                        </div>
                        <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
                            Delete Account
                        </button>
                    </div>
                </div>
            </section>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="delete-modal" onClick={e => e.stopPropagation()}>
                        <div className="delete-modal-header">
                            <span className="delete-icon">⚠️</span>
                            <h3>Delete Your Account?</h3>
                        </div>
                        <div className="delete-modal-body">
                            <p className="delete-warning">
                                This action is <strong>permanent</strong> and cannot be undone.
                                All your data, messages, and session history will be permanently deleted.
                            </p>

                            {!isGoogleUser && (
                                <div className="delete-password-field">
                                    <label>Enter your password to confirm:</label>
                                    <input
                                        type="password"
                                        className="input"
                                        placeholder="Your password"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                    />
                                </div>
                            )}

                            {isGoogleUser && (
                                <p className="google-notice">
                                    You'll be asked to re-authenticate with Google to confirm.
                                </p>
                            )}

                            {deleteError && (
                                <p className="delete-error">{deleteError}</p>
                            )}
                        </div>
                        <div className="delete-modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    setDeletePassword('')
                                    setDeleteError('')
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete Forever'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Settings
