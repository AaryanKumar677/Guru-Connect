/* ==============================
   Authentication Service
   Handles user login, signup, Google/GitHub OAuth, logout,
   profile updates, account deletion with Firebase Auth & Firestore
   ============================== */
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
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

            if (userDoc.exists()) {
                return { id: firebaseUser.uid, ...userDoc.data() };
            } else {
                return {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || 'User',
                    role: 'student'
                };
            }
        } catch (error) {
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

    signup: async (userData) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );
            const firebaseUser = userCredential.user;

            await updateProfile(firebaseUser, {
                displayName: userData.fullName || userData.name
            });

            const userProfile = {
                id: firebaseUser.uid,
                email: userData.email,
                name: userData.fullName || userData.name,
                role: userData.role || 'student',
                createdAt: new Date().toISOString(),
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
                ...(userData.role === 'tutor' && {
                    subjects: userData.subjects || [],
                    teachingStyle: userData.teachingStyle,
                    experience: userData.experience,
                    hourlyRate: userData.hourlyRate || 500,
                    bio: userData.bio || '',
                    collegeName: userData.collegeName || userData.collegeManualName || '',
                    education: userData.collegeName || userData.collegeManualName || ''
                }),
                languages: userData.languages || [],
                timezone: userData.timezone || 'Asia/Kolkata',
                avatar: null
            };

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Profile creation timed out')), 10000)
            );

            try {
                await Promise.race([
                    setDoc(doc(db, 'users', firebaseUser.uid), userProfile),
                    timeoutPromise
                ]);
            } catch (dbError) {
                console.error("Firestore Profile Creation Failed:", dbError);
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

    googleSignIn: async (role = 'student') => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

            if (userDoc.exists()) {
                return { id: firebaseUser.uid, ...userDoc.data(), isNewUser: false };
            } else {
                const userProfile = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || 'User',
                    avatar: firebaseUser.photoURL,
                    role: role || 'pending',
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

    githubSignIn: async (role = 'student') => {
        try {
            const result = await signInWithPopup(auth, githubProvider);
            const firebaseUser = result.user;

            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

            if (userDoc.exists()) {
                return { id: firebaseUser.uid, ...userDoc.data(), isNewUser: false };
            } else {
                const userProfile = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || 'User',
                    avatar: firebaseUser.photoURL,
                    role: role || 'pending',
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

    logout: async () => {
        await signOut(auth);
    },

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

    getCurrentUser: () => {
        return auth.currentUser;
    },

    deleteAccount: async (password = null) => {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No user logged in');
        }

        try {
            if (password && user.providerData[0]?.providerId === 'password') {
                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential);
            }
            else if (user.providerData[0]?.providerId === 'google.com') {
                await reauthenticateWithPopup(user, googleProvider);
            }
            else if (user.providerData[0]?.providerId === 'github.com') {
                await reauthenticateWithPopup(user, githubProvider);
            }

            await deleteDoc(doc(db, 'users', user.uid));

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
