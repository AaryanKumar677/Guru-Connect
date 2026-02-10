import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './VideoCall.css';

export const createVideoRoom = (baseName) => {
    const safe = String(baseName).replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    // Use public Jitsi domain by default
    return `https://meet.jit.si/${safe}`;
};

const VideoCall = ({ roomUrl, onLeave, participantName, onCancel }) => {
    const containerRef = useRef(null);
    const apiRef = useRef(null);
    const [callState, setCallState] = useState('joining');
    const [jitsiLoaded, setJitsiLoaded] = useState(false);

    useEffect(() => {
        if (apiRef.current) return;

        if (window.JitsiMeetExternalAPI) {
            setJitsiLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://8x8.vc/vpaas-magic-cookie-58eecbe32e2e4466a89ceaa3d993654d/external_api.js';
        script.async = true;
        script.onload = () => setJitsiLoaded(true);
        script.onerror = () => {
            console.error('Failed to load Jitsi API');
            setCallState('error');
        };
        document.body.appendChild(script);

        return () => {
        };
    }, []);

    useEffect(() => {
        if (!jitsiLoaded || !roomUrl || !containerRef.current) return;

        if (apiRef.current) return;

        const domain = 'meet.jit.si';

        let roomName = roomUrl;
        if (roomUrl.includes('8x8.vc')) {
            // Support legacy 8x8.vc URLs by extracting the room name
            roomName = roomUrl.split('/').pop();
        } else if (roomUrl.includes(domain)) {
            roomName = roomUrl.replace(`https://${domain}/`, '');
        }

        try {
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

    return createPortal(
        <div className="video-call-container">
            <div
                ref={containerRef}
                className="video-call-frame"
                style={{ width: '100%', height: '100%' }}
            />

            {callState !== 'joined' && (
                <div className="video-call-controls">
                    <button className="btn btn-error" onClick={handleLeave}>
                        <span className="material-symbols-outlined">call_end</span>
                        End Call
                    </button>
                </div>
            )}
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
