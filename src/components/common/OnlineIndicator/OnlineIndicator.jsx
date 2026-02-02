// Online Indicator Component - Shows user online/offline status
import React from 'react';
import './OnlineIndicator.css';

const OnlineIndicator = ({ online, lastSeen, size = 'medium', showLabel = false }) => {
    const getLastSeenText = () => {
        if (!lastSeen) return 'Offline';

        const now = new Date();
        const lastSeenDate = lastSeen.toDate ? lastSeen.toDate() : new Date(lastSeen);
        const diffMs = now - lastSeenDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return lastSeenDate.toLocaleDateString();
    };

    return (
        <div className={`online-indicator-wrapper ${size}`}>
            <span className={`online-dot ${online ? 'online' : 'offline'}`} />
            {showLabel && (
                <span className={`online-label ${online ? 'online' : 'offline'}`}>
                    {online ? 'Online' : getLastSeenText()}
                </span>
            )}
        </div>
    );
};

export default OnlineIndicator;
