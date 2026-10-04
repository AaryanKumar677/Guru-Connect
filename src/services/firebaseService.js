/* ==============================
   Firebase Service - Core Database Operations
   Handles user profiles, real-time presence (online/offline status),
   chat CRUD operations, messaging, and chat subscriptions via Firestore & RTDB
   ============================== */
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
    writeBatch
} from 'firebase/firestore';
import {
    ref,
    onValue,
    set,
    onDisconnect,
    serverTimestamp as rtdbTimestamp
} from 'firebase/database';
import { db, rtdb } from '../config/firebase';

export const createUserProfile = async (userId, userData) => {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    }, { merge: true });
};

export const getUserProfile = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const getAllTutors = async () => {
    const tutorsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'tutor')
    );
    const snapshot = await getDocs(tutorsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

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

export const setupPresence = (userId) => {
    console.log('[Presence] Setting up presence for user:', userId);

    const userStatusRef = ref(rtdb, `/status/${userId}`);
    const userDocRef = doc(db, 'users', userId);

    const connectedRef = ref(rtdb, '.info/connected');

    const unsubscribe = onValue(connectedRef, async (snapshot) => {
        console.log('[Presence] Connection status changed:', snapshot.val());

        if (snapshot.val() === true) {
            console.log('[Presence] Connected! Setting online status...');

            try {
                await set(userStatusRef, {
                    online: true,
                    lastSeen: rtdbTimestamp()
                });
                console.log('[Presence] RTDB status set to online');

                await onDisconnect(userStatusRef).set({
                    online: false,
                    lastSeen: rtdbTimestamp()
                });
                console.log('[Presence] onDisconnect handler set');

                await setDoc(userDocRef, {
                    presence: {
                        online: true,
                        lastSeen: serverTimestamp()
                    }
                }, { merge: true });
                console.log('[Presence] Firestore presence updated');
            } catch (error) {
                console.error('[Presence] Error setting presence:', error);
            }
        } else {
            console.log('[Presence] Not connected to Firebase RTDB');
        }
    });

    return unsubscribe;
};

export const subscribeToUserPresence = (userId, callback) => {
    console.log('[Presence] Subscribing to presence for user:', userId);
    const userStatusRef = ref(rtdb, `/status/${userId}`);
    return onValue(userStatusRef, (snapshot) => {
        const data = snapshot.val();
        console.log('[Presence] Received presence data for', userId, ':', data);
        callback(data || { online: false, lastSeen: null });
    });
};

export const getOrCreateChat = async (userId1, userId2) => {
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

export const sendMessage = async (chatId, senderId, text) => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
        text,
        senderId,
        timestamp: serverTimestamp(),
        read: false
    });

    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
        lastMessage: {
            text,
            senderId,
            timestamp: serverTimestamp()
        }
    });
};

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

export const markMessagesAsRead = async (chatId, userId) => {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
        [`unreadCount.${userId}`]: 0
    });
};

export const clearChat = async (chatId) => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const snapshot = await getDocs(messagesRef);

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();

    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
        lastMessage: {
            text: 'Chat cleared',
            timestamp: serverTimestamp(),
            system: true
        }
    });
};
