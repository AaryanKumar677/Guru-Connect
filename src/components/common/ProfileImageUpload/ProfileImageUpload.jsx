import { useState, useRef } from 'react'
import { storageService } from '../../../services/storageService'
import { useToast } from '../../../App'
import './ProfileImageUpload.css'

const ProfileImageUpload = ({ userId, currentAvatar, userName, onImageUpdate }) => {
    const { showToast } = useToast()
    const fileInputRef = useRef(null)
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return '?'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Show preview immediately
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewUrl(reader.result)
        }
        reader.readAsDataURL(file)

        setIsUploading(true)
        try {
            // Compress image before upload
            const compressedFile = await storageService.compressImage(file, 400, 0.8)

            // Upload to Firebase Storage
            const downloadURL = await storageService.uploadProfileImage(userId, compressedFile)

            // Notify parent component
            if (onImageUpdate) {
                onImageUpdate(downloadURL)
            }

            showToast('Profile photo updated!', 'success')
        } catch (error) {
            showToast(error.message, 'error')
            setPreviewUrl(null) // Revert preview on error
        } finally {
            setIsUploading(false)
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleRemoveImage = async () => {
        if (!currentAvatar) return

        setIsUploading(true)
        try {
            await storageService.deleteProfileImage(userId, currentAvatar)
            setPreviewUrl(null)

            if (onImageUpdate) {
                onImageUpdate(null)
            }

            showToast('Profile photo removed', 'info')
        } catch (error) {
            showToast(error.message, 'error')
        } finally {
            setIsUploading(false)
        }
    }

    const displayImage = previewUrl || currentAvatar

    return (
        <div className="profile-image-upload">
            <div className="avatar-container">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={userName || 'Profile'}
                        className="avatar-image"
                    />
                ) : (
                    <div className="avatar-initials">
                        {getInitials(userName)}
                    </div>
                )}

                {isUploading && (
                    <div className="avatar-loading">
                        <div className="upload-spinner"></div>
                    </div>
                )}
            </div>

            <div className="avatar-actions">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="file-input"
                    id="avatar-upload"
                    disabled={isUploading}
                />
                <label htmlFor="avatar-upload" className="btn btn-outline upload-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {currentAvatar ? 'Change Photo' : 'Upload Photo'}
                </label>

                {currentAvatar && (
                    <button
                        className="btn btn-ghost remove-btn"
                        onClick={handleRemoveImage}
                        disabled={isUploading}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Remove
                    </button>
                )}
            </div>

            <p className="upload-hint">JPEG, PNG, GIF or WebP • Max 5MB</p>
        </div>
    )
}

export default ProfileImageUpload
