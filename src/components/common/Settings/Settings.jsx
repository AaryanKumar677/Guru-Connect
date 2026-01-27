import { useState } from 'react'
import { useTheme, useAuth, useToast } from '../../../App'
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

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
        showToast('Notification settings updated', 'success')
    }

    const handlePrivacyChange = (key) => {
        setPrivacy(prev => ({ ...prev, [key]: !prev[key] }))
        showToast('Privacy settings updated', 'success')
    }

    const handleDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            logout()
            showToast('Account deleted successfully', 'info')
        }
    }

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
                        <button className="btn btn-danger" onClick={handleDeleteAccount}>
                            Delete Account
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Settings
