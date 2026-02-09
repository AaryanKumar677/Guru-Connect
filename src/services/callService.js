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
import { createVideoRoom } from '../components/common/VideoCall/VideoCall';
import { sendMessage } from './firebaseService';

export const initiateCall = async (callerId, callerName, callerAvatar, recipientId, chatId, type = 'video') => {
    try {
        const roomUrl = createVideoRoom(`guru-call-${chatId}`);

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

        setTimeout(async () => {
            try {
                const callDoc = doc(db, 'callRequests', callRef.id);
                await updateDoc(callDoc, { status: 'missed' });

                const timeStr = new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                await sendMessage(chatId, callerId, `📞 Missed ${type} call at ${timeStr}`);
            } catch (e) {
                console.log('Call status already changed');
            }
        }, 30000);

        return { callId: callRef.id, roomUrl };
    } catch (error) {
        console.error('Error initiating call:', error);
        throw error;
    }
};

export const acceptCall = async (callId) => {
    const callRef = doc(db, 'callRequests', callId);
    await updateDoc(callRef, { status: 'accepted' });
};

export const declineCall = async (callId) => {
    const callRef = doc(db, 'callRequests', callId);
    await updateDoc(callRef, { status: 'declined' });
};

export const cancelCall = async (callId) => {
    const callRef = doc(db, 'callRequests', callId);
    await updateDoc(callRef, { status: 'missed' });
};

export const endCall = async (callId) => {
    const callRef = doc(db, 'callRequests', callId);
    await updateDoc(callRef, { status: 'ended' });
};

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

export const subscribeToCallStatus = (callId, callback) => {
    const callRef = doc(db, 'callRequests', callId);
    return onSnapshot(callRef, (snapshot) => {
        if (snapshot.exists()) {
            callback({ id: snapshot.id, ...snapshot.data() });
        }
    });
};

export const cleanupOldCalls = async (userId) => {
    console.log('Call cleanup would run here');
};
