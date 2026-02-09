import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import './ImageCropper.css'

const ImageCropper = ({ image, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropChange = (crop) => {
        setCrop(crop)
    }

    const onZoomChange = (zoom) => {
        setZoom(zoom)
    }

    const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', (error) => reject(error))
            image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
            image.src = url
        })

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            return null
        }

        // set canvas width to final desired crop size - this will clear existing context
        canvas.width = image.width
        canvas.height = image.height

        // paste generated rotate image at the top left corner
        ctx.drawImage(image, 0, 0)

        // set canvas width to final desired crop size - this will clear existing context
        const data = ctx.getImageData(
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height
        )

        // set canvas width to final desired crop size - this will clear existing context
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        // paste generated rotate image with correct offsets for x,y crop values.
        ctx.putImageData(data, 0, 0)

        // As Base64 string
        return new Promise((resolve, reject) => {
            canvas.toBlob((file) => {
                if (file) {
                    resolve(file)
                } else {
                    reject(new Error('Canvas is empty'))
                }
            }, 'image/jpeg', 1) // High quality
        })
    }

    const handleSave = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels)
            onCropComplete(croppedImageBlob)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="cropper-modal-overlay">
            <div className="cropper-modal">
                <div className="cropper-header">
                    <h3>Adjust Photo</h3>
                    <button className="close-btn" onClick={onCancel}>&times;</button>
                </div>

                <div className="cropper-container">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteCallback}
                        onZoomChange={onZoomChange}
                        showGrid={false}
                        cropShape="round"
                    />
                </div>

                <div className="slider-container">
                    <span className="slider-icon">−</span>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(e.target.value)}
                        className="zoom-range"
                    />
                    <span className="slider-icon">+</span>
                </div>

                <div className="cropper-actions">
                    <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>Save & Upload</button>
                </div>
            </div>
        </div>
    )
}

export default ImageCropper
