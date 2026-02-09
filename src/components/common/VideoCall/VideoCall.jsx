// Video Call Component - Jitsi Meet integration (FREE, no account required)
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './VideoCall.css';

// Generate a random room name for Jitsi
export const createVideoRoom = (baseName) => {
    const roomId = `${baseName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // Jitsi Meet public server - completely free, no account needed
    return `https://meet.jit.si/${roomId}`;
};

const VideoCall = ({ roomUrl, onLeave, participantName, onCancel }) => {
    const containerRef = useRef(null);
    const apiRef = useRef(null);
    const [callState, setCallState] = useState('joining');
    const [jitsiLoaded, setJitsiLoaded] = useState(false);

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

    // Initialize Jitsi call when script is loaded
    useEffect(() => {
        if (!jitsiLoaded || !roomUrl || !containerRef.current) return;

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
                    prejoinPageEnabled: false,
                    disableDeepLinking: true,
                    enableWelcomePage: false,
                    enableClosePage: false,
                    disableInviteFunctions: true,
                    hideConferenceSubject: true,
                    hideConferenceTimer: true,
                    subject: 'GuruConnect Call',
                    // Disable lobby and moderator requirements
                    enableLobbyChat: false,
                    hideLobbyButton: true,
                    requireDisplayName: false,
                    enableInsecureRoomNameWarning: false,
                    disableModeratorIndicator: true,
                    startAudioOnly: false,
                    enableNoisyMicDetection: false,
                    enableNoAudioDetection: false
                },
                interfaceConfigOverwrite: {
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'desktop', 'fullscreen',
                        'hangup', 'chat', 'settings', 'videoquality'
                    ],
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    MOBILE_APP_PROMO: false,
                    HIDE_INVITE_MORE_HEADER: true,
                    DISABLE_PRESENCE_STATUS: true
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
    }, [jitsiLoaded, roomUrl, participantName, onLeave]);

    const handleLeave = () => {
        if (apiRef.current) {
            apiRef.current.executeCommand('hangup');
        }
        onLeave?.();
    };

    // Use Portal to render at body level - bypasses all parent container constraints
    return createPortal(
        <div className="video-call-container">
            {/* Jitsi iframe container - always visible */}
            <div
                ref={containerRef}
                className="video-call-frame"
                style={{ width: '100%', height: '100%' }}
            />

            {/* End call button */}
            <div className="video-call-controls">
                <button className="btn btn-error" onClick={handleLeave}>
                    <span className="material-symbols-outlined">call_end</span>
                    End Call
                </button>
            </div>
        </div>,
        document.body
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
