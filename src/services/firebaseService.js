// Firebase Service - Helper functions for database operations
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    addDoc,
    serverTimestamp,
    limit
} from 'firebase/firestore';
import {
    ref,
    onValue,
    set,
    onDisconnect,
    serverTimestamp as rtdbTimestamp
} from 'firebase/database';
import { db, rtdb } from '../config/firebase';

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Create or update user profile in Firestore
 */
export const createUserProfile = async (userId, userData) => {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    }, { merge: true });
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

/**
 * Get all tutors
 */
export const getAllTutors = async () => {
    const tutorsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'tutor')
    );
    const snapshot = await getDocs(tutorsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Subscribe to tutors with real-time updates
 */
export const subscribeTutors = (callback) => {
    const tutorsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'tutor')
    );
    return onSnapshot(tutorsQuery, (snapshot) => {
        const tutors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(tutors);
    });
};

// ============================================
// PRESENCE SYSTEM
// ============================================

/**
 * Set up presence tracking for a user
 */
export const setupPresence = (userId) => {
    const userStatusRef = ref(rtdb, `/status/${userId}`);
    const userDocRef = doc(db, 'users', userId);

    // When connected, update presence
    const connectedRef = ref(rtdb, '.info/connected');

    onValue(connectedRef, async (snapshot) => {
        if (snapshot.val() === true) {
            // Set online status
            await set(userStatusRef, {
                online: true,
                lastSeen: rtdbTimestamp()
            });

            // When disconnected, set offline
            onDisconnect(userStatusRef).set({
                online: false,
                lastSeen: rtdbTimestamp()
            });

            // Update Firestore too
            await updateDoc(userDocRef, {
                'presence.online': true,
                'presence.lastSeen': serverTimestamp()
            });
        }
    });
};

/**
 * Subscribe to a user's online status
 */
export const subscribeToUserPresence = (userId, callback) => {
    const userStatusRef = ref(rtdb, `/status/${userId}`);
    return onValue(userStatusRef, (snapshot) => {
        const data = snapshot.val();
        callback(data || { online: false, lastSeen: null });
    });
};

// ============================================
// CHAT OPERATIONS
// ============================================

/**
 * Create or get existing chat between two users
 */
export const getOrCreateChat = async (userId1, userId2) => {
    // Check if chat exists
    const chatsQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId1)
    );

    const snapshot = await getDocs(chatsQuery);
    const existingChat = snapshot.docs.find(doc => {
        const data = doc.data();
        return data.participants.includes(userId2);
    });

    if (existingChat) {
        return { id: existingChat.id, ...existingChat.data() };
    }

    // Create new chat
    const chatRef = await addDoc(collection(db, 'chats'), {
        participants: [userId1, userId2],
        createdAt: serverTimestamp(),
        lastMessage: null,
        unreadCount: {
            [userId1]: 0,
            [userId2]: 0
        }
    });

    return { id: chatRef.id, participants: [userId1, userId2] };
};

/**
 * Send a message
 */
export const sendMessage = async (chatId, senderId, text) => {
    // Add message to messages subcollection
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
        text,
        senderId,
        timestamp: serverTimestamp(),
        read: false
    });

    // Update chat's last message
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
        lastMessage: {
            text,
            senderId,
            timestamp: serverTimestamp()
        }
    });
};

/**
 * Subscribe to chat messages
 */
export const subscribeToMessages = (chatId, callback) => {
    const messagesQuery = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('timestamp', 'asc')
    );

    return onSnapshot(messagesQuery, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(messages);
    });
};

/**
 * Get user's chats
 */
export const subscribeToUserChats = (userId, callback) => {
    const chatsQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId)
    );

    return onSnapshot(chatsQuery, (snapshot) => {
        const chats = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(chats);
    });
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (chatId, userId) => {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
        [`unreadCount.${userId}`]: 0
    });
};
