/* ==============================
   Call UI Component - Voice/Video Call Interface
   Full-screen call overlay with incoming/outgoing/active states,
   call controls (mute, video, speaker), duration timer, and caller info
   ============================== */
import { useState, useEffect } from 'react'
import './CallUI.css'

const CallUI = ({
    isOpen,
    onClose,
    callerName = 'Prof. Sharma',
    callerSubject = 'Mathematics',
    callerAvatar = '👨‍🏫',
    callType = 'incoming' // 'incoming', 'outgoing', 'active'
}) => {
    const [callState, setCallState] = useState(callType)
    const [callDuration, setCallDuration] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [isSpeakerOn, setIsSpeakerOn] = useState(false)

    useEffect(() => {
        let timer
        if (callState === 'active') {
            timer = setInterval(() => {
                setCallDuration(prev => prev + 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [callState])

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleAccept = () => {
        setCallState('active')
    }

    const handleReject = () => {
        onClose?.()
    }

    const handleEndCall = () => {
        onClose?.()
    }

    if (!isOpen) return null

    return (
        <div className="call-overlay">
            <div className={`call-container ${callState}`}>
                {/* Background Effect */}
                <div className="call-bg-effect"></div>

                {/* Caller Info */}
                <div className="caller-info">
                    <div className={`caller-avatar ${callState === 'active' ? 'active' : 'ringing'}`}>
                        <span>{callerAvatar}</span>
                    </div>
                    <h2 className="caller-name">{callerName}</h2>
                    <p className="caller-subject">{callerSubject}</p>

                    {callState === 'incoming' && (
                        <span className="call-status incoming">Incoming Call...</span>
                    )}
                    {callState === 'outgoing' && (
                        <span className="call-status outgoing">Calling...</span>
                    )}
                    {callState === 'active' && (
                        <span className="call-status active">{formatDuration(callDuration)}</span>
                    )}
                </div>

                {/* Call Controls */}
                <div className="call-controls">
                    {callState === 'incoming' && (
                        <>
                            <button className="call-btn reject" onClick={handleReject}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                            </button>
                            <button className="call-btn accept" onClick={handleAccept}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                            </button>
                        </>
                    )}

                    {callState === 'active' && (
                        <>
                            <button
                                className={`call-btn secondary ${isMuted ? 'active' : ''}`}
                                onClick={() => setIsMuted(!isMuted)}
                            >
                                {isMuted ? '🔇' : '🎤'}
                            </button>
                            <button
                                className={`call-btn secondary ${!isVideoOn ? 'active' : ''}`}
                                onClick={() => setIsVideoOn(!isVideoOn)}
                            >
                                {isVideoOn ? '📹' : '📷'}
                            </button>
                            <button className="call-btn reject" onClick={handleEndCall}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                            </button>
                            <button
                                className={`call-btn secondary ${isSpeakerOn ? 'active' : ''}`}
                                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                            >
                                {isSpeakerOn ? '🔊' : '🔈'}
                            </button>
                        </>
                    )}

                    {callState === 'outgoing' && (
                        <button className="call-btn reject" onClick={handleReject}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CallUI
