// Video Call Component - Daily.co integration
import React, { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import './VideoCall.css';

const DAILY_API_KEY = 'YOUR_DAILY_API_KEY'; // Get from daily.co dashboard

const VideoCall = ({ roomUrl, onLeave, participantName }) => {
    const callRef = useRef(null);
    const containerRef = useRef(null);
    const [callState, setCallState] = useState('joining'); // joining, joined, left, error

    useEffect(() => {
        if (!roomUrl || !containerRef.current) return;

        const startCall = async () => {
            try {
                callRef.current = DailyIframe.createFrame(containerRef.current, {
                    iframeStyle: {
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '12px'
                    },
                    showLeaveButton: true,
                    showFullscreenButton: true
                });

                callRef.current.on('joining-meeting', () => setCallState('joining'));
                callRef.current.on('joined-meeting', () => setCallState('joined'));
                callRef.current.on('left-meeting', () => {
                    setCallState('left');
                    onLeave?.();
                });
                callRef.current.on('error', (error) => {
                    console.error('Daily.co error:', error);
                    setCallState('error');
                });

                await callRef.current.join({
                    url: roomUrl,
                    userName: participantName || 'User'
                });
            } catch (error) {
                console.error('Failed to join call:', error);
                setCallState('error');
            }
        };

        startCall();

        return () => {
            if (callRef.current) {
                callRef.current.destroy();
            }
        };
    }, [roomUrl, participantName, onLeave]);

    const handleLeave = () => {
        if (callRef.current) {
            callRef.current.leave();
        }
        onLeave?.();
    };

    return (
        <div className="video-call-container">
            {callState === 'joining' && (
                <div className="video-call-loading">
                    <div className="loading-spinner"></div>
                    <p>Connecting to call...</p>
                </div>
            )}

            {callState === 'error' && (
                <div className="video-call-error">
                    <span>❌</span>
                    <p>Failed to connect to call</p>
                    <button className="btn btn-primary" onClick={onLeave}>
                        Close
                    </button>
                </div>
            )}

            <div
                ref={containerRef}
                className={`video-call-frame ${callState === 'joined' ? 'visible' : ''}`}
            />

            {callState === 'joined' && (
                <div className="video-call-controls">
                    <button className="btn btn-error" onClick={handleLeave}>
                        End Call
                    </button>
                </div>
            )}
        </div>
    );
};

// Video Call Button - Used on tutor cards
export const VideoCallButton = ({ tutorId, tutorName, onStartCall }) => {
    const [creating, setCreating] = useState(false);

    const createRoom = async () => {
        setCreating(true);
        try {
            // For demo, we'll create a simple room URL
            // In production, you'd call Daily.co API to create a room
            const roomName = `guruconnect-${tutorId}-${Date.now()}`;
            const roomUrl = `https://guruconnect.daily.co/${roomName}`;

            // In production, create room via API:
            // const response = await fetch('https://api.daily.co/v1/rooms', {
            //     method: 'POST',
            //     headers: { Authorization: `Bearer ${DAILY_API_KEY}` },
            //     body: JSON.stringify({ name: roomName, properties: { exp: Date.now()/1000 + 3600 } })
            // });

            onStartCall(roomUrl);
        } catch (error) {
            console.error('Failed to create room:', error);
        }
        setCreating(false);
    };

    return (
        <button
            className="btn btn-secondary video-call-button"
            onClick={createRoom}
            disabled={creating}
        >
            {creating ? '...' : '📹'} Video Call
        </button>
    );
};

export default VideoCall;
