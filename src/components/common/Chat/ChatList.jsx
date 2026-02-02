// Chat List Component - Shows all conversations
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../App';
import { subscribeToUserChats, getUserProfile, subscribeToUserPresence } from '../../../services/firebaseService';
import OnlineIndicator from '../OnlineIndicator/OnlineIndicator';
import './Chat.css';

const ChatListItem = ({ chat, currentUserId, onClick }) => {
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

    return (
        <div className="chat-list-item" onClick={() => onClick(chat, otherUserId)}>
            <div className="chat-list-avatar">
                <div className="chat-avatar">
                    {otherUser?.avatar || '👤'}
                </div>
                <OnlineIndicator online={presence.online} size="small" />
            </div>
            <div className="chat-list-info">
                <span className="chat-list-name">
                    {otherUser?.name || 'Loading...'}
                </span>
                <span className="chat-list-preview">
                    {chat.lastMessage?.text || 'No messages yet'}
                </span>
            </div>
            <div className="chat-list-meta">
                <span className="chat-list-time">
                    {formatTime(chat.lastMessage?.timestamp)}
                </span>
                {unreadCount > 0 && (
                    <span className="chat-unread-badge">{unreadCount}</span>
                )}
            </div>
        </div>
    );
};

const ChatList = ({ onSelectChat }) => {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = user?.uid || user?.id;

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = subscribeToUserChats(userId, (chatList) => {
            // Sort by last message time
            const sorted = chatList.sort((a, b) => {
                const aTime = a.lastMessage?.timestamp?.toMillis?.() || 0;
                const bTime = b.lastMessage?.timestamp?.toMillis?.() || 0;
                return bTime - aTime;
            });
            setChats(sorted);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    if (loading) {
        return (
            <div className="chat-list-loading">
                <div className="loading-spinner"></div>
                <p>Loading conversations...</p>
            </div>
        );
    }

    if (chats.length === 0) {
        return (
            <div className="chat-list-empty">
                <span>💬</span>
                <p>No conversations yet</p>
                <p className="text-sm text-secondary">Start chatting with a tutor!</p>
            </div>
        );
    }

    return (
        <div className="chat-list">
            {chats.map((chat) => (
                <ChatListItem
                    key={chat.id}
                    chat={chat}
                    currentUserId={userId}
                    onClick={onSelectChat}
                />
            ))}
        </div>
    );
};

export default ChatList;
