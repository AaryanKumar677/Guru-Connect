// Global Call Listener - Shows incoming call notification anywhere in the app
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToIncomingCalls, acceptCall, declineCall } from '../../services/callService';
import { useAuth } from '../../App';
import VideoCall from '../common/VideoCall/VideoCall';
import './GlobalCallListener.css';

const GlobalCallListener = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [incomingCall, setIncomingCall] = useState(null);
    const [activeCall, setActiveCall] = useState(null);

    useEffect(() => {
        if (!user) return;

        const userId = user.uid || user.id;

        const unsubscribe = subscribeToIncomingCalls(userId, (calls) => {
            if (calls && calls.length > 0) {
                // Get the most recent pending call
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

    // Don't render if no user
    if (!user) return null;

    return (
        <>
            {/* Global Incoming Call Popup */}
            {incomingCall && (
                <div className="global-incoming-call-overlay">
                    <div className="global-incoming-call-modal">
                        <div className="caller-info">
                            <div className="caller-avatar">
                                {incomingCall.callerAvatar ? (
                                    <img src={incomingCall.callerAvatar} alt={incomingCall.callerName} />
                                ) : (
                                    <span className="material-symbols-outlined">person</span>
                                )}
                            </div>
                            <h3>{incomingCall.callerName || 'Someone'}</h3>
                            <p>Incoming {incomingCall.type || 'video'} call...</p>
                        </div>
                        <div className="call-actions">
                            <button className="call-btn decline" onClick={handleDecline}>
                                <span className="material-symbols-outlined">call_end</span>
                            </button>
                            <button className="call-btn accept" onClick={handleAccept}>
                                <span className="material-symbols-outlined">call</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Video Call Overlay */}
            {activeCall && (
                <div className="global-video-call-overlay">
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
