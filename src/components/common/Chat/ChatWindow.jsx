// Chat Window Component - Real-time messaging interface
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../App';
import {
    subscribeToMessages,
    sendMessage,
    getUserProfile,
    subscribeToUserPresence
} from '../../../services/firebaseService';
import OnlineIndicator from '../OnlineIndicator/OnlineIndicator';
import './Chat.css';

const ChatWindow = ({ chatId, recipientId, onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipient, setRecipient] = useState(null);
    const [recipientPresence, setRecipientPresence] = useState({ online: false });
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Load recipient info
    useEffect(() => {
        const loadRecipient = async () => {
            const profile = await getUserProfile(recipientId);
            setRecipient(profile);
        };
        loadRecipient();
    }, [recipientId]);

    // Subscribe to presence
    useEffect(() => {
        const unsubscribe = subscribeToUserPresence(recipientId, setRecipientPresence);
        return () => unsubscribe();
    }, [recipientId]);

    // Subscribe to messages
    useEffect(() => {
        if (!chatId) return;
        const unsubscribe = subscribeToMessages(chatId, setMessages);
        return () => unsubscribe();
    }, [chatId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            await sendMessage(chatId, user.uid || user.id, newMessage.trim());
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
        setSending(false);
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Helper to render avatar
    const renderAvatar = (user) => {
        const avatar = user?.avatar || user?.photoURL;
        if (avatar && typeof avatar === 'string' && (avatar.startsWith('http') || avatar.startsWith('/'))) {
            return <img src={avatar} alt={user?.name || 'User'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />;
        }
        return avatar || '👤';
    };

    return (
        <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
                <div className="chat-recipient">
                    <div className="chat-avatar">
                        {renderAvatar(recipient)}
                    </div>
                    <div className="chat-recipient-info">
                        <span className="chat-recipient-name">
                            {recipient?.name || 'Loading...'}
                        </span>
                        <OnlineIndicator
                            online={recipientPresence.online}
                            lastSeen={recipientPresence.lastSeen}
                            size="small"
                            showLabel
                        />
                    </div>
                </div>
                <div className="chat-actions">
                    <button className="btn btn-ghost btn-sm" title="Video Call">
                        📹
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>
                        ✕
                    </button>
                </div>
            </div>

            {/* Offline Notice */}
            {!recipientPresence.online && (
                <div className="offline-notice">
                    <span>📬</span>
                    {recipient?.name || 'User'} is offline. They'll be notified when online.
                </div>
            )}

            {/* Messages */}
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="chat-empty">
                        <span>💬</span>
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`message ${msg.senderId === (user.uid || user.id) ? 'sent' : 'received'}`}
                        >
                            <div className="message-content">
                                <p>{msg.text}</p>
                                <span className="message-time">{formatTime(msg.timestamp)}</span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-input-form" onSubmit={handleSend}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                />
                <button
                    type="submit"
                    className="btn btn-primary chat-send-btn"
                    disabled={!newMessage.trim() || sending}
                >
                    {sending ? '...' : '➤'}
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
