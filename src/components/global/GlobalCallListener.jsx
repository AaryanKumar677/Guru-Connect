/* ==============================
   Global Call Listener Component
   Listens for incoming video/voice calls across the entire app,
   shows incoming call UI overlay regardless of which page user is on
   ============================== */
import React, { useState, useEffect } from 'react';
import { subscribeToIncomingCalls, acceptCall, declineCall } from '../../services/callService';
import { useAuth } from '../../App';
import IncomingCall from '../common/VideoCall/IncomingCall';
import VideoCall from '../common/VideoCall/VideoCall';

const GlobalCallListener = () => {
    const { user } = useAuth();
    const [incomingCall, setIncomingCall] = useState(null);
    const [activeCall, setActiveCall] = useState(null);

    useEffect(() => {
        if (!user) return;

        const userId = user.uid || user.id;

        const unsubscribe = subscribeToIncomingCalls(userId, (calls) => {
            if (calls && calls.length > 0) {
                const pendingCall = calls[0];
                setIncomingCall(pendingCall);
            } else {
                setIncomingCall(null);
            }
        });

        return () => unsubscribe();
    }, [user]);

    const handleAccept = async () => {
        if (!incomingCall) return;

        try {
            await acceptCall(incomingCall.id);
            setActiveCall({
                roomUrl: incomingCall.roomUrl,
                callId: incomingCall.id
            });
            setIncomingCall(null);
        } catch (error) {
            console.error('Failed to accept call:', error);
        }
    };

    const handleDecline = async () => {
        if (!incomingCall) return;

        try {
            await declineCall(incomingCall.id);
            setIncomingCall(null);
        } catch (error) {
            console.error('Failed to decline call:', error);
        }
    };

    const handleEndCall = () => {
        setActiveCall(null);
    };

    if (!user) return null;

    return (
        <>
            {/* Use existing IncomingCall popup design */}
            {incomingCall && (
                <IncomingCall
                    callerName={incomingCall.callerName || 'Someone'}
                    callerAvatar={incomingCall.callerAvatar}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                />
            )}

            {/* Global Video Call Overlay */}
            {activeCall && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: '#000',
                    zIndex: 9998
                }}>
                    <VideoCall
                        roomUrl={activeCall.roomUrl}
                        onLeave={handleEndCall}
                        participantName={user?.name || user?.displayName || 'User'}
                    />
                </div>
            )}
        </>
    );
};

export default GlobalCallListener;
