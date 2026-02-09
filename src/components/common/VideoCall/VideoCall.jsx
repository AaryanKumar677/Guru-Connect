// Video Call Component - Jitsi Meet integration (FREE, no account required)
import React, { useEffect, useRef, useState } from 'react';
import './VideoCall.css';

// Generate a random room name for Jitsi
export const createVideoRoom = (baseName) => {
    const roomId = `${baseName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // Jitsi Meet public server - completely free, no account needed
    return `https://meet.jit.si/${roomId}`;
};

const VideoCall = ({ roomUrl, onLeave, participantName, isCalling, onCancel }) => {
    const containerRef = useRef(null);
    const apiRef = useRef(null);
    const [callState, setCallState] = useState('joining');
    const [jitsiLoaded, setJitsiLoaded] = useState(false);

    // ... (rest of jitsi loading logic remains same)

    // Handle isCalling state - if true, we show a calling overlay instead of Jitsi
    const showJitsi = !isCalling && roomUrl;

    // Load Jitsi API script
    useEffect(() => {
        if (window.JitsiMeetExternalAPI) {
            setJitsiLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => setJitsiLoaded(true);
        script.onerror = () => {
            console.error('Failed to load Jitsi API');
            setCallState('error');
        };
        document.body.appendChild(script);

        return () => {
            // Don't remove script on unmount as other calls might need it
        };
    }, []);

    // Initialize Jitsi call when script is loaded AND not calling state
    useEffect(() => {
        if (!jitsiLoaded || !showJitsi || !containerRef.current) return;

        // Extract room name from URL
        const roomName = roomUrl.replace('https://meet.jit.si/', '');

        try {
            const domain = 'meet.jit.si';
            const options = {
                roomName: roomName,
                width: '100%',
                height: '100%',
                parentNode: containerRef.current,
                userInfo: {
                    displayName: participantName || 'User'
                },
                configOverwrite: {
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    prejoinPageEnabled: false
                },
                interfaceConfigOverwrite: {
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'desktop', 'fullscreen',
                        'hangup', 'chat', 'settings', 'videoquality'
                    ],
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false
                }
            };

            apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

            apiRef.current.addListener('videoConferenceJoined', () => {
                setCallState('joined');
            });

            apiRef.current.addListener('videoConferenceLeft', () => {
                setCallState('left');
                onLeave?.();
            });

            apiRef.current.addListener('readyToClose', () => {
                onLeave?.();
            });

        } catch (error) {
            console.error('Failed to initialize Jitsi:', error);
            setCallState('error');
        }

        return () => {
            if (apiRef.current) {
                apiRef.current.dispose();
                apiRef.current = null;
            }
        };
    }, [jitsiLoaded, roomUrl, participantName, onLeave, showJitsi]);

    const handleLeave = () => {
        if (apiRef.current) {
            apiRef.current.executeCommand('hangup');
        }
        onLeave?.();
    };

    if (isCalling) {
        return (
            <div className="video-call-container">
                <div className="video-call-calling">
                    <div className="calling-avatar">
                        <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>person</span>
                    </div>
                    <h3>Calling...</h3>
                    <p>Waiting for answer</p>
                    <div className="calling-actions">
                        <button className="btn btn-error btn-circle" onClick={onCancel}>
                            <span className="material-symbols-outlined">call_end</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                    <button className="btn btn-primary" onClick={onLeave}>
                        Close
                    </button>
                </div>
            )}

            <div
                ref={containerRef}
                className={`video-call-frame ${callState === 'joined' ? 'visible' : ''}`}
                style={{ width: '100%', height: '100%' }}
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
export const VideoCallButton = ({ tutorId, onStartCall }) => {
    const [creating, setCreating] = useState(false);

    const handleCreateRoom = () => {
        setCreating(true);
        const roomUrl = createVideoRoom(`guru-${tutorId}`);
        onStartCall(roomUrl);
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
