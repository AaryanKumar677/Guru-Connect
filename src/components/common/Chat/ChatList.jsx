// Chat List Component - Shows all conversations
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../App';
import { subscribeToUserChats, getUserProfile, subscribeToUserPresence } from '../../../services/firebaseService';
import OnlineIndicator from '../OnlineIndicator/OnlineIndicator';
import './Chat.css';

const ChatListItem = ({ chat, currentUserId, onClick, isActive }) => {
    const [otherUser, setOtherUser] = useState(null);
    const [presence, setPresence] = useState({ online: false });

    const otherUserId = chat.participants?.find(id => id !== currentUserId);

    useEffect(() => {
        if (!otherUserId) return;

        const loadUser = async () => {
            const profile = await getUserProfile(otherUserId);
            setOtherUser(profile);
        };
        loadUser();

        const unsubscribe = subscribeToUserPresence(otherUserId, setPresence);
        return () => unsubscribe();
    }, [otherUserId]);

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const unreadCount = chat.unreadCount?.[currentUserId] || 0;

    // Helper to render avatar
    const renderAvatar = () => {
        const avatar = otherUser?.avatar || otherUser?.photoURL;
        if (avatar && typeof avatar === 'string' && (avatar.startsWith('http') || avatar.startsWith('/'))) {
            return <img src={avatar} alt={otherUser?.name || 'User'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />;
        }
        return avatar || <span className="material-icons-outlined">person</span>;
    };

    // Determine role
    const role = otherUser?.role || 'user';

    return (
        <div
            className={`chat-list-item ${isActive ? 'active' : ''}`}
            onClick={() => onClick(chat, otherUserId)}
        >
            <div className="chat-list-avatar">
                <div className="chat-avatar">
                    {renderAvatar()}
                </div>
                <OnlineIndicator online={presence.online} size="medium" />
            </div>
            <div className="chat-list-info">
                <div className="chat-list-name-row">
                    <span className="chat-list-name">
                        {otherUser?.name || 'Loading...'}
                    </span>
                    <span className="chat-list-time">
                        {formatTime(chat.lastMessage?.timestamp)}
                    </span>
                </div>
                <span className="chat-list-preview">
                    {chat.lastMessage?.text || 'No messages yet'}
                </span>
                {role !== 'user' && (
                    <span className={`chat-role-badge ${role}`}>
                        {role === 'tutor' ? 'Tutor' : 'Student'}
                    </span>
                )}
            </div>
            <div className="chat-list-meta">
                {unreadCount > 0 && (
                    <span className="chat-unread-badge">{unreadCount}</span>
                )}
            </div>
        </div>
    );
};

const ChatList = ({ onSelectChat, selectedChatId }) => {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const userId = user?.uid || user?.id;

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = subscribeToUserChats(userId, (chatList) => {
            // Sort by last message time
            const validChats = chatList.filter(chat => chat.lastMessage);
            const sorted = validChats.sort((a, b) => {
                const aTime = a.lastMessage?.timestamp?.toMillis?.() || 0;
                const bTime = b.lastMessage?.timestamp?.toMillis?.() || 0;
                return bTime - aTime;
            });
            setChats(sorted);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    // Filter chats based on search
    const filteredChats = chats; // Search filtering would need async user name lookup

    if (loading) {
        return (
            <div className="chat-list-loading">
                <div className="loading-spinner"></div>
                <p>Loading conversations...</p>
            </div>
        );
    }

    return (
        <>
            {/* Search Input */}
            <div className="chat-search-container">
                <div className="chat-search-wrapper">
                    <span className="material-icons-outlined search-icon">search</span>
                    <input
                        type="text"
                        className="chat-search-input"
                        placeholder="Search conversations"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="chat-list">
                {filteredChats.length === 0 ? (
                    <div className="chat-list-empty">
                        <span className="material-icons-outlined">chat_bubble_outline</span>
                        <p>No conversations yet</p>
                        <p className="text-sm text-secondary">Start chatting with a tutor!</p>
                    </div>
                ) : (
                    filteredChats.map((chat) => (
                        <ChatListItem
                            key={chat.id}
                            chat={chat}
                            currentUserId={userId}
                            onClick={onSelectChat}
                            isActive={selectedChatId === chat.id}
                        />
                    ))
                )}
            </div>
        </>
    );
};

export default ChatList;
