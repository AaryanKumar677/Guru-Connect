import React from 'react';
import './IncomingCall.css';

const IncomingCall = ({ callerName, callerAvatar, onAccept, onDecline }) => {
    return (
        <div className="incoming-call-overlay">
            <div className="incoming-call-card glass-panel">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>

                <div className="card-content">
                    <div className="call-header">
                        <h3>INCOMING VIDEO CALL...</h3>
                        <p>GuruConnect Live Session</p>
                    </div>

                    <div className="avatar-section">
                        <div className="avatar-pulse-ring"></div>
                        <div className="avatar-wrapper">
                            <img
                                src={callerAvatar || "https://ui-avatars.com/api/?name=" + callerName + "&background=random"}
                                alt={callerName}
                                className="caller-img"
                            />
                        </div>
                        <div className="status-badge">
                            <span className="material-symbols-outlined">videocam</span>
                        </div>
                    </div>

                    <div className="caller-details">
                        <h2>{callerName}</h2>
                        <p className="session-type">Live Interactive Session</p>
                    </div>

                    <div className="action-buttons">
                        <button
                            className="btn-action decline"
                            onClick={onDecline}
                            aria-label="Decline Call"
                        >
                            <span className="material-symbols-outlined">call_end</span>
                        </button>

                        <button
                            className="btn-action accept"
                            onClick={onAccept}
                            aria-label="Accept Call"
                        >
                            <span className="material-symbols-outlined">videocam</span>
                        </button>

                        <button
                            className="btn-action chat"
                            aria-label="Message"
                        >
                            <span className="material-symbols-outlined">chat</span>
                        </button>
                    </div>

                    <button className="audio-only-btn">
                        <span className="material-symbols-outlined">chat</span>
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomingCall;
