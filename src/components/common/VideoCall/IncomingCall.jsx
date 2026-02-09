import React from 'react';
import './IncomingCall.css';

const IncomingCall = ({ callerName, callerAvatar, onAccept, onDecline }) => {
    return (
        <div className="incoming-call-overlay">
            <div className="incoming-call-card">
                <div className="call-info">
                    <div className="caller-avatar-container">
                        <img
                            src={callerAvatar || "https://ui-avatars.com/api/?name=" + callerName + "&background=random"}
                            alt={callerName}
                            className="caller-avatar"
                        />
                        <div className="pulsing-ring"></div>
                    </div>
                    <h3 className="caller-name">{callerName}</h3>
                    <p className="call-status">Incoming Video Call...</p>
                    <p className="call-context">GuruConnect Live Session</p>
                </div>

                <div className="call-actions">
                    <button className="call-btn decline" onClick={onDecline}>
                        <span className="material-symbols-outlined">call_end</span>
                    </button>
                    <button className="call-btn accept" onClick={onAccept}>
                        <span className="material-symbols-outlined">videocam</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomingCall;
