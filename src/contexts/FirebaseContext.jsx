// Firebase Context Provider
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile, setupPresence } from '../services/firebaseService';

const FirebaseContext = createContext(null);

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useFirebase must be used within FirebaseProvider');
    }
    return context;
};

export const FirebaseProvider = ({ children }) => {
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let presenceUnsubscribe = null;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('[FirebaseContext] Auth state changed:', user?.uid || 'no user');
            setFirebaseUser(user);

            if (user) {
                // Get user profile from Firestore
                const profile = await getUserProfile(user.uid);
                console.log('[FirebaseContext] User profile loaded:', profile?.name || 'no profile');
                setUserProfile(profile);

                // Setup presence tracking
                console.log('[FirebaseContext] Setting up presence...');
                presenceUnsubscribe = setupPresence(user.uid);
            } else {
                setUserProfile(null);
                // Cleanup presence subscription
                if (presenceUnsubscribe) {
                    presenceUnsubscribe();
                    presenceUnsubscribe = null;
                }
            }

            setLoading(false);
        });

        return () => {
            unsubscribe();
            if (presenceUnsubscribe) {
                presenceUnsubscribe();
            }
        };
    }, []);

    const value = {
        firebaseUser,
        userProfile,
        loading,
        isAuthenticated: !!firebaseUser
    };

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseContext;
