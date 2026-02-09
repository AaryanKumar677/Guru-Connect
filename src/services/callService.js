// Call Service - Firebase functions for video/voice call management
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { createDailyRoom } from '../components/common/VideoCall/VideoCall';
import { sendMessage } from './firebaseService';

/**
 * Initiate a call to another user
 */
export const initiateCall = async (callerId, callerName, callerAvatar, recipientId, chatId, type = 'video') => {
    try {
        // Create Daily.co room
        const roomName = `guru-call-${chatId}-${Date.now()}`;
        const roomUrl = await createDailyRoom(roomName);

        // Create call request in Firestore
        const callRef = await addDoc(collection(db, 'callRequests'), {
            callerId,
            callerName,
            callerAvatar,
            recipientId,
            chatId,
            roomUrl,
            type,
            status: 'ringing',
            createdAt: serverTimestamp()
        });

        // Auto-timeout after 30 seconds
        setTimeout(async () => {
            try {
                const callDoc = doc(db, 'callRequests', callRef.id);
                // Check if still ringing, then mark as missed
                await updateDoc(callDoc, { status: 'missed' });

                // Send missed call message to chat
                const timeStr = new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                await sendMessage(chatId, callerId, `📞 Missed ${type} call at ${timeStr}`);
            } catch (e) {
                // Call might have been answered/declined already
                console.log('Call status already changed');
            }
        }, 30000);

        return { callId: callRef.id, roomUrl };
    } catch (error) {
        console.error('Error initiating call:', error);
        throw error;
    }
};

/**
 * Accept an incoming call
 */
export const acceptCall = async (callId) => {
    const callRef = doc(db, 'callRequests', callId);
    await updateDoc(callRef, { status: 'accepted' });
};

/**
 * Decline an incoming call
 */
export const declineCall = async (callId) => {
    const callRef = doc(db, 'callRequests', callId);
    await updateDoc(callRef, { status: 'declined' });
};

/**
 * End an ongoing call
 */
export const endCall = async (callId) => {
    const callRef = doc(db, 'callRequests', callId);
    await updateDoc(callRef, { status: 'ended' });
};

/**
 * Subscribe to incoming calls for a user
 */
export const subscribeToIncomingCalls = (userId, callback) => {
    const callsQuery = query(
        collection(db, 'callRequests'),
        where('recipientId', '==', userId),
        where('status', '==', 'ringing')
    );

    return onSnapshot(callsQuery, (snapshot) => {
        const calls = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(calls);
    });
};

/**
 * Subscribe to call status changes (for the caller)
 */
export const subscribeToCallStatus = (callId, callback) => {
    const callRef = doc(db, 'callRequests', callId);
    return onSnapshot(callRef, (snapshot) => {
        if (snapshot.exists()) {
            callback({ id: snapshot.id, ...snapshot.data() });
        }
    });
};

/**
 * Clean up old call requests (called periodically or on app start)
 */
export const cleanupOldCalls = async (userId) => {
    // This would typically be done with a Cloud Function
    // For now, we just listen to active calls
    console.log('Call cleanup would run here');
};
