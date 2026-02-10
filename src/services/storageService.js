import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';

export const storageService = {
    uploadProfileImage: async (userId, file) => {
        console.log('storageService.uploadProfileImage called', { userId, file });
        if (!file) throw new Error('No file provided');

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            throw new Error('Please upload a valid image (JPEG, PNG, GIF, or WebP)');
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('Image size must be less than 5MB');
        }

        try {
            const fileExtension = file.name.split('.').pop();
            const fileName = `${userId}_${Date.now()}.${fileExtension}`;
            const storageRef = ref(storage, `avatars/${fileName}`);
            console.log('Storage Ref created:', storageRef);

            console.log('Starting uploadBytes...');
            const snapshot = await uploadBytes(storageRef, file);
            console.log('uploadBytes complete:', snapshot);

            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('Download URL retrieved:', downloadURL);

            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                avatar: downloadURL,
                updatedAt: new Date().toISOString()
            });
            console.log('Firestore updated');

            return downloadURL;
        } catch (error) {
            console.error('Upload error in storageService:', error);
            throw new Error('Failed to upload image. Please try again.');
        }
    },

    deleteProfileImage: async (userId, imageUrl) => {
        try {
            if (imageUrl && imageUrl.includes('firebase')) {
                const urlParts = imageUrl.split('/o/')[1];
                if (urlParts) {
                    const filePath = decodeURIComponent(urlParts.split('?')[0]);
                    const storageRef = ref(storage, filePath);
                    await deleteObject(storageRef);
                }
            }

            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                avatar: null,
                updatedAt: new Date().toISOString()
            });

            return { success: true };
        } catch (error) {
            console.error('Delete error:', error);
            throw new Error('Failed to delete image');
        }
    },

    compressImage: (file, maxWidth = 400, quality = 0.8) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now()
                                }));
                            } else {
                                reject(new Error('Failed to compress image'));
                            }
                        },
                        'image/jpeg',
                        quality
                    );
                };
                img.onerror = () => reject(new Error('Failed to load image'));
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
        });
    }
};
