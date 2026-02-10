import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DailyIframe from '@daily-co/daily-js';
import './VideoCall.css';

const JITSI_TENANT = 'vpaas-magic-cookie-58e43aaa86384305b7a102b54a10ce10';

export const createVideoRoom = (baseName) => {
    const safe = String(baseName).replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    // Use 8x8.vc with tenant ID
    return `https://8x8.vc/${JITSI_TENANT}/${safe}`;
};

const VideoCall = ({ roomUrl, onLeave, participantName, onCancel }) => {
    const containerRef = useRef(null);
    const jitsiApiRef = useRef(null);
    const dailyCallRef = useRef(null);
    const [callState, setCallState] = useState('joining');
    const [jitsiLoaded, setJitsiLoaded] = useState(false);

    // Detect provider
    const provider = roomUrl?.includes('daily.co') ? 'daily' : 'jitsi';

    useEffect(() => {
        if (provider !== 'jitsi' || jitsiApiRef.current) return;

        const script = document.createElement('script');
        script.src = `https://8x8.vc/${JITSI_TENANT}/external_api.js`;
        script.async = true;
        script.onload = () => setJitsiLoaded(true);
        script.onerror = () => {
            console.error('Failed to load Jitsi API');
            setCallState('error');
        };
        document.body.appendChild(script);

        return () => { };
    }, [provider]);

    useEffect(() => {
        if (!roomUrl || !containerRef.current) return;

        if (provider === 'daily') {
            if (dailyCallRef.current) return;

            try {
                const call = DailyIframe.createFrame(containerRef.current, {
                    iframeStyle: {
                        width: '100%',
                        height: '100%',
                        border: '0',
                    },
                    showLeaveButton: true,
                    userName: participantName || 'User'
                });

                call.join({ url: roomUrl });
                dailyCallRef.current = call;

                call.on('joined-meeting', () => setCallState('joined'));
                call.on('left-meeting', () => {
                    setCallState('left');
                    onLeave?.();
                });
                call.on('error', (e) => {
                    console.error('Daily error:', e);
                    setCallState('error');
                });

            } catch (error) {
                console.error('Failed to initialize Daily:', error);
                setCallState('error');
            }

            return () => {
                if (dailyCallRef.current) {
                    dailyCallRef.current.destroy();
                    dailyCallRef.current = null;
                }
            };
        } else {
            // Jitsi / 8x8.vc Logic
            if (!jitsiLoaded || jitsiApiRef.current) return;

            const domain = '8x8.vc';
            let roomName = roomUrl;

            // Extract room name and handle tenant prefix
            if (roomUrl.includes(domain)) {
                roomName = roomUrl.split('/').slice(3).join('/') || roomUrl.split('/').pop();
            } else if (roomUrl.includes('meet.jit.si')) {
                roomName = roomUrl.replace('https://meet.jit.si/', '');
            }

            // Ensure roomName includes the tenant for 8x8.vc initialization
            if (!roomName.startsWith(JITSI_TENANT)) {
                roomName = `${JITSI_TENANT}/${roomName}`;
            }

            try {
                const options = {
                    roomName: roomName,
                    width: '100%',
                    height: '100%',
                    parentNode: containerRef.current,
                    // New JWT provided by user (expires in 2h)
                    jwt: "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtNThlNDNhYWE4NjM4NDMwNWI3YTEwMmI1NGExMGNlMTAvNDUzMWI5LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NzA2OTcwOTYsImV4cCI6MTc3MDcwNDI5NiwibmJmIjoxNzcwNjk3MDkxLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtNThlNDNhYWE4NjM4NDMwNWI3YTEwMmI1NGExMGNlMTAiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJmaWxlLXVwbG9hZCI6ZmFsc2UsIm91dGJvdW5kLWNhbGwiOmZhbHNlLCJzaXAtb3V0Ym91bmQtY2FsbCI6ZmFsc2UsInRyYW5zY3JpcHRpb24iOmZhbHNlLCJsaXN0LXZpc2l0b3JzIjpmYWxzZSwicmVjb3JkaW5nIjpmYWxzZSwiZmxpcCI6ZmFsc2V9LCJ1c2VyIjp7ImhpZGRlbi1mcm9tLXJlY29yZGVyIjpmYWxzZSwibW9kZXJhdG9yIjp0cnVlLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWQiOiJnb29nbGUtb2F1dGgyfDExNTE3MzgwMTU2NTUyNDM5MDIzOSIsImF2YXRhciI6IiIsImVtYWlsIjoidGVzdC51c2VyQGNvbXBhbnkuY29tIn19LCJyb29tIjoiKiJ9.PEBROf-9ry_HfjX7w3qdgqgHoMnLMn-FIHpx6V4mrhHZDg-I_HAxOdVWZTn9buZx_h32ebtNMmwV31azXcqXVdLlLK5bTWapkSMu7mIFMyJw0nY2WjmuHrXsdNM-U3fcWmbz64HRglnAiMcKl1O9IDoNsBrQJm_qxWSkqlo-ZmEeQAhK24pMSgTIV4hsrjejAuSkJFu0osT6Jel11l7mg7kU3Am_4hWvnk8xwLH_Pkgo0IVs-Aglq_HLyDcLNrPEb_7bhEV99UdKBSlCWwB9h-1u1WIxHWJu_t6F9te8qy63lK5txwwLQgh8aqOWgqGuVBxt7odYGBqLj1wB3jjEJw",
                    userInfo: {
                        displayName: participantName || 'User'
                    },
                    configOverwrite: {
                        startWithAudioMuted: false,
                        startWithVideoMuted: false,
                        prejoinPageEnabled: false,
                        disableDeepLinking: true,
                    },
                    interfaceConfigOverwrite: {
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'desktop', 'fullscreen',
                            'hangup', 'chat', 'settings', 'videoquality'
                        ],
                        SHOW_JITSI_WATERMARK: false,
                    }
                };

                jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

                jitsiApiRef.current.addListener('videoConferenceJoined', () => setCallState('joined'));
                jitsiApiRef.current.addListener('videoConferenceLeft', () => {
                    setCallState('left');
                    onLeave?.();
                });
                jitsiApiRef.current.addListener('readyToClose', () => onLeave?.());

            } catch (error) {
                console.error('Failed to initialize Jitsi:', error);
                setCallState('error');
            }

            return () => {
                if (jitsiApiRef.current) {
                    jitsiApiRef.current.dispose();
                    jitsiApiRef.current = null;
                }
            };
        }
    }, [jitsiLoaded, roomUrl, participantName, onLeave, provider]);

    const handleLeave = () => {
        if (provider === 'daily' && dailyCallRef.current) {
            dailyCallRef.current.leave();
        } else if (jitsiApiRef.current) {
            jitsiApiRef.current.executeCommand('hangup');
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
