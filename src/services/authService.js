// Firebase Authentication Service
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    signOut,
    updateProfile,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider,
    reauthenticateWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const authService = {
    // Login with Email/Password
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Fetch user profile from Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

            if (userDoc.exists()) {
                return { id: firebaseUser.uid, ...userDoc.data() };
            } else {
                // Return basic info if no Firestore profile exists
                return {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || 'User',
                    role: 'student' // Default role
                };
            }
        } catch (error) {
            // Map Firebase errors to user-friendly messages
            const errorMessages = {
                'auth/user-not-found': 'No account found with this email',
                'auth/wrong-password': 'Invalid password',
                'auth/invalid-email': 'Please enter a valid email address',
                'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
                'auth/invalid-credential': 'Invalid email or password'
            };
            throw new Error(errorMessages[error.code] || error.message);
        }
    },

    // Signup with Email/Password
    signup: async (userData) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );
            const firebaseUser = userCredential.user;

            // Update display name
            await updateProfile(firebaseUser, {
                displayName: userData.fullName || userData.name
            });

            // Create user profile in Firestore
            const userProfile = {
                id: firebaseUser.uid,
                email: userData.email,
                name: userData.fullName || userData.name,
                role: userData.role || 'student',
                createdAt: new Date().toISOString(),
                // Student fields
                ...(userData.role === 'student' && {
                    educationType: userData.educationType,
                    schoolName: userData.schoolName,
                    className: userData.className,
                    collegeName: userData.collegeName || userData.collegeManualName,
                    degree: userData.degree,
                    branch: userData.branch,
                    year: userData.year,
                    semester: userData.semester
                }),
                // Tutor fields
                ...(userData.role === 'tutor' && {
                    subjects: userData.subjects || [],
                    teachingStyle: userData.teachingStyle,
                    experience: userData.experience,
                    hourlyRate: userData.hourlyRate || 500,
                    bio: userData.bio || ''
                }),
                // Common optional fields
                languages: userData.languages || [],
                timezone: userData.timezone || 'Asia/Kolkata',
                avatar: null
            };

            // Timeout Promise for Firestore
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Profile creation timed out')), 10000)
            );

            try {
                // Create user profile in Firestore (with timeout)
                await Promise.race([
                    setDoc(doc(db, 'users', firebaseUser.uid), userProfile),
                    timeoutPromise
                ]);
            } catch (dbError) {
                console.error("Firestore Profile Creation Failed:", dbError);
                // Rollback: Delete the auth user if profile creation fails
                // so the user can try signing up again
                await deleteUser(firebaseUser);
                throw new Error('Failed to create account profile. Please check your internet connection.');
            }

            return userProfile;
        } catch (error) {
            const errorMessages = {
                'auth/email-already-in-use': 'An account with this email already exists',
                'auth/invalid-email': 'Please enter a valid email address',
                'auth/weak-password': 'Password should be at least 6 characters'
            };
            throw new Error(errorMessages[error.code] || error.message);
        }
    },

    // Google Sign-In
    googleSignIn: async (role = 'student') => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            // Check if user profile exists in Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

            if (userDoc.exists()) {
                return { id: firebaseUser.uid, ...userDoc.data(), isNewUser: false };
            } else {
                // New Google user - create basic profile
                // If role is null, use 'pending' - user will select in role modal
                const userProfile = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || 'User',
                    avatar: firebaseUser.photoURL,
                    role: role || 'pending', // 'pending' means user needs to select role
                    createdAt: new Date().toISOString(),
                    languages: [],
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
                };

                await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);

                return { ...userProfile, isNewUser: true };
            }
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
                throw new Error('Sign-in cancelled');
            }
            throw new Error(error.message || 'Google sign-in failed');
        }
    },

    // GitHub Sign-In
    githubSignIn: async (role = 'student') => {
        try {
            const result = await signInWithPopup(auth, githubProvider);
            const firebaseUser = result.user;

            // Check if user profile exists in Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

            if (userDoc.exists()) {
                return { id: firebaseUser.uid, ...userDoc.data(), isNewUser: false };
            } else {
                // New GitHub user - create basic profile
                const userProfile = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || 'User',
                    avatar: firebaseUser.photoURL,
                    role: role || 'pending', // 'pending' means user needs to select role
                    createdAt: new Date().toISOString(),
                    languages: [],
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
                };

                await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);

                return { ...userProfile, isNewUser: true };
            }
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
                throw new Error('Sign-in cancelled');
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                throw new Error('An account already exists with the same email address but different sign-in credentials.');
            }
            throw new Error(error.message || 'GitHub sign-in failed');
        }
    },

    // Logout
    logout: async () => {
        await signOut(auth);
    },

    // Update user profile
    updateUser: async (userId, updates) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });

            const updatedDoc = await getDoc(userRef);
            return { id: userId, ...updatedDoc.data() };
        } catch (error) {
            throw new Error('Failed to update profile');
        }
    },

    // Get user by ID
    getUser: async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                return { id: userId, ...userDoc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    },

    // Get current Firebase auth user
    getCurrentUser: () => {
        return auth.currentUser;
    },

    // Delete user account completely
    deleteAccount: async (password = null) => {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No user logged in');
        }

        try {
            // For email/password users, reauthenticate with password
            if (password && user.providerData[0]?.providerId === 'password') {
                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential);
            }
            // For Google users, reauthenticate with popup
            else if (user.providerData[0]?.providerId === 'google.com') {
                await reauthenticateWithPopup(user, googleProvider);
            }
            // For GitHub users, reauthenticate with popup
            else if (user.providerData[0]?.providerId === 'github.com') {
                await reauthenticateWithPopup(user, githubProvider);
            }

            // Delete user data from Firestore first
            await deleteDoc(doc(db, 'users', user.uid));

            // Delete user from Firebase Auth
            await deleteUser(user);

            return { success: true };
        } catch (error) {
            const errorMessages = {
                'auth/requires-recent-login': 'Please re-enter your password to delete your account',
                'auth/wrong-password': 'Incorrect password',
                'auth/popup-closed-by-user': 'Action cancelled'
            };
            throw new Error(errorMessages[error.code] || error.message || 'Failed to delete account');
        }
    }
};
