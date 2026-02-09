import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './VideoCall.css';

export const createVideoRoom = (baseName) => {
    const safe = String(baseName).replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const tenantPath = 'vpaas-magic-cookie-58eecbe32e2e4466a89ceaa3d993654d';
    return `https://8x8.vc/${tenantPath}/${safe}`;
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

        const apiDomain = '8x8.vc';
        const domain = '8x8.vc';
        const tenantPath = 'vpaas-magic-cookie-58eecbe32e2e4466a89ceaa3d993654d';

        let roomName = roomUrl;
        if (roomUrl.includes(apiDomain)) {
            roomName = roomUrl.replace(`https://${apiDomain}/`, '');
        }

        try {
            const options = {
                roomName: roomName,
                width: '100%',
                height: '100%',
                parentNode: containerRef.current,
                jwt: "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtNThlZWNiZTMyZTJlNDQ2NmE4OWNlYWEzZDk5MzY1NGQvODcwNDhlLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NzA2Njg4OTcsImV4cCI6MTc3MDY3NjA5NywibmJmIjoxNzcwNjY4ODkyLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtNThlZWNiZTMyZTJlNDQ2NmE4OWNlYWEzZDk5MzY1NGQiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJmaWxlLXVwbG9hZCI6ZmFsc2UsIm91dGJvdW5kLWNhbGwiOmZhbHNlLCJzaXAtb3V0Ym91bmQtY2FsbCI6ZmFsc2UsInRyYW5zY3JpcHRpb24iOmZhbHNlLCJsaXN0LXZpc2l0b3JzIjpmYWxzZSwicmVjb3JkaW5nIjpmYWxzZSwiZmxpcCI6ZmFsc2V9LCJ1c2VyIjp7ImhpZGRlbi1mcm9tLXJlY29yZGVyIjpmYWxzZSwibW9kZXJhdG9yIjp0cnVlLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWQiOiJnb29nbGUtb2F1dGgyfDEwMzg3NjYzMDM1ODQ0MjEzNDQ3MiIsImF2YXRhciI6IiIsImVtYWlsIjoidGVzdC51c2VyQGNvbXBhbnkuY29tIn19LCJyb29tIjoiKiJ9.I5Yjtezz1H3PhUghjzStxB6x9Kw2p6O2LR3sfVMVqfdJ1jq1nN3sX-TTNR9tGIn0H6B21hPrKYarUEKkscoc6r5h_tGxCTKM_suytKPlFT8nHFIfsXTyKQzqHZmDYnj3jDaXYoEFUXg0yrahmx8rjfIOUopMkx3Cte3vlano32_sxCFXlZ8smHemf2Ni3hbGRNrjbGGdENN17mBTDX23ZzyCFu3bsmCxZBF3Ta-L6rGSk7vjpKWB0_v6VH425-DtB2nali6H7AILnbN1MHvrfHjQZORw59nWqiEXSxm-zmBXEIlviZYQTcVB1Vlwm_itxaHo-DOpMedhf-c3LympIw",
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
