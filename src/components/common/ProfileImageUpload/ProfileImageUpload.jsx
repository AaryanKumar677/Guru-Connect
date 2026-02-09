import { useState, useRef } from 'react'
import { storageService } from '../../../services/storageService'
import { useToast } from '../../../App'
import ImageCropper from '../ImageCropper/ImageCropper'
import './ProfileImageUpload.css'

const ProfileImageUpload = ({ userId, currentAvatar, userName, onImageUpdate }) => {
    const { showToast } = useToast()
    const fileInputRef = useRef(null)
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [cropImage, setCropImage] = useState(null)
    const [showCropper, setShowCropper] = useState(false)

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return '?'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Read file for cropper
        const reader = new FileReader()
        reader.onload = () => {
            setCropImage(reader.result)
            setShowCropper(true)
        }
        reader.readAsDataURL(file)

        // Reset input immediately so same file can be selected again if cancelled
        e.target.value = ''
    }

    const handleCropComplete = async (croppedImageBlob) => {
        console.log('handleCropComplete started', croppedImageBlob);
        setShowCropper(false)
        setCropImage(null)

        // Show preview of cropped image
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewUrl(reader.result)
        }
        reader.readAsDataURL(croppedImageBlob)

        setIsUploading(true)
        try {
            console.log('Preparing file for upload...');
            // No need to compress again as cropper outputs efficiently, 
            // but we can ensure it's a File object
            const fileToUpload = new File([croppedImageBlob], "avatar.jpg", { type: "image/jpeg" })
            console.log('File created:', fileToUpload);

            // Upload to Firebase Storage
            console.log('Calling storageService.uploadProfileImage...');
            const downloadURL = await storageService.uploadProfileImage(userId, fileToUpload)
            console.log('Upload successful, URL:', downloadURL);

            // Notify parent component
            if (onImageUpdate) {
                onImageUpdate(downloadURL)
            }

            showToast('Profile photo updated!', 'success')
        } catch (error) {
            console.error('Upload failed:', error);
            showToast(error.message || 'Failed to update photo', 'error')
            setPreviewUrl(null) // Revert preview on error
        } finally {
            setIsUploading(false)
        }
    }

    const handleCancelCrop = () => {
        setShowCropper(false)
        setCropImage(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
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
            {showCropper && cropImage && (
                <ImageCropper
                    image={cropImage}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCancelCrop}
                />
            )}

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
