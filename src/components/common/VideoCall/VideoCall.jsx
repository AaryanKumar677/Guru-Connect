// Video Call Component - Daily.co integration
import React, { useEffect, useRef, useState, useCallback } from 'react';
import DailyIframe from '@daily-co/daily-js';
import './VideoCall.css';

const DAILY_API_KEY = '956139e61e2883d0063d0e207b4af79a428c1fe27fe64d6c195daf6ae16012b7';
// IMPORTANT: Change this to your Daily.co subdomain from your dashboard
const DAILY_DOMAIN = 'guruconnect'; // e.g., if your rooms are at yourname.daily.co, use 'yourname'

// Helper function to create a Daily.co room
export const createDailyRoom = async (roomName) => {
    try {
        const response = await fetch('https://api.daily.co/v1/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DAILY_API_KEY}`
            },
            body: JSON.stringify({
                name: roomName,
                properties: {
                    exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
                    enable_chat: true,
                    enable_screenshare: true,
                    start_video_off: false,
                    start_audio_off: false
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Daily API Error:', errorData);
            // If room already exists, just return the URL
            if (errorData.error === 'invalid-request-error' && errorData.info?.includes('already exists')) {
                return `https://${DAILY_DOMAIN}.daily.co/${roomName}`;
            }
            throw new Error(errorData.info || 'Failed to create room');
        }

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Error creating Daily room:', error);
        // Fallback to direct URL (room might already exist)
        return `https://${DAILY_DOMAIN}.daily.co/${roomName}`;
    }
};

const VideoCall = ({ roomUrl, onLeave, participantName }) => {
    const callRef = useRef(null);
    const containerRef = useRef(null);
    const [callState, setCallState] = useState('joining'); // joining, joined, left, error
    const hasInitialized = useRef(false);

    useEffect(() => {
        // Prevent duplicate initialization (React Strict Mode fix)
        if (!roomUrl || !containerRef.current || hasInitialized.current) return;
        hasInitialized.current = true;

        const startCall = async () => {
            try {
                // Destroy any existing iframe first
                if (callRef.current) {
                    try {
                        await callRef.current.destroy();
                    } catch (e) {
                        console.log('No existing call to destroy');
                    }
                }

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
            hasInitialized.current = false;
            if (callRef.current) {
                try {
                    callRef.current.destroy();
                } catch (e) {
                    console.log('Cleanup error:', e);
                }
                callRef.current = null;
            }
        };
    }, [roomUrl, participantName, onLeave]);

    const handleLeave = useCallback(() => {
        if (callRef.current) {
            callRef.current.leave();
        }
        onLeave?.();
    }, [onLeave]);

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
                    <span className="material-symbols-outlined">error</span>
                    <p>Failed to connect to call</p>
                    <p style={{ fontSize: '12px', opacity: 0.7 }}>Please check your Daily.co configuration</p>
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
                        <span className="material-symbols-outlined">call_end</span>
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

    const handleCreateRoom = async () => {
        setCreating(true);
        try {
            const roomName = `guru-${tutorId}-${Date.now()}`;
            const roomUrl = await createDailyRoom(roomName);
            onStartCall(roomUrl);
        } catch (error) {
            console.error('Failed to create room:', error);
        }
        setCreating(false);
    };

    return (
        <button
            className="btn btn-secondary video-call-button"
            onClick={handleCreateRoom}
            disabled={creating}
        >
            <span className="material-symbols-outlined">videocam</span>
            {creating ? 'Starting...' : 'Video Call'}
        </button>
    );
};

export default VideoCall;
