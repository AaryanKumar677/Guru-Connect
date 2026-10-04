/* ==============================
   Chat Window Component - Real-time Messaging
   Full chat interface with real-time messages, emoji picker, file attachments,
   video/voice call buttons, online status, clear chat, and GuruAI assist toggle
   ============================== */
import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../../../App';
import {
    subscribeToMessages,
    sendMessage,
    getUserProfile,
    subscribeToUserPresence,
    clearChat
} from '../../../services/firebaseService';
import {
    initiateCall,
    acceptCall as acceptCallService,
    declineCall as declineCallService,
    cancelCall as cancelCallService,
    subscribeToIncomingCalls,
    subscribeToCallStatus
} from '../../../services/callService';
import OnlineIndicator from '../OnlineIndicator/OnlineIndicator';
import VideoCall from '../VideoCall/VideoCall';
import IncomingCall from '../VideoCall/IncomingCall';
import '../VideoCall/VideoCall.css';
import './Chat.css';

const ChatWindow = ({ chatId, recipientId, onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipient, setRecipient] = useState(null);
    const [recipientPresence, setRecipientPresence] = useState({ online: false });
    const [sending, setSending] = useState(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [videoRoomUrl, setVideoRoomUrl] = useState(null);
    const [showIncomingCall, setShowIncomingCall] = useState(false);
    const [incomingCallData, setIncomingCallData] = useState(null);
    const [currentCallId, setCurrentCallId] = useState(null);
    const [isCalling, setIsCalling] = useState(false);
    const [isAiMode, setIsAiMode] = useState(true);
    const [showOptions, setShowOptions] = useState(false);

    const messagesEndRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const fileInputRef = useRef(null);
    const optionsRef = useRef(null);

    useEffect(() => {
        const loadRecipient = async () => {
            const profile = await getUserProfile(recipientId);
            setRecipient(profile);
        };
        loadRecipient();
    }, [recipientId]);

    useEffect(() => {
        const unsubscribe = subscribeToUserPresence(recipientId, setRecipientPresence);
        return () => unsubscribe();
    }, [recipientId]);

    useEffect(() => {
        if (!chatId) return;
        const unsubscribe = subscribeToMessages(chatId, setMessages);
        return () => unsubscribe();
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!user) return;
        const userId = user.uid || user.id;

        const unsubscribe = subscribeToIncomingCalls(userId, (calls) => {
            if (calls.length > 0) {
                const latestCall = calls[0];
                setIncomingCallData(latestCall);
                setShowIncomingCall(true);
            } else {
                setShowIncomingCall(false);
                setIncomingCallData(null);
            }
        });

        return () => unsubscribe();
    }, [user]);

    const startVideoCall = async () => {
        try {
            const userId = user.uid || user.id;
            const userName = user.name || user.displayName || 'User';
            const userAvatar = user.photoURL || user.avatar || '';

            const { callId, roomUrl } = await initiateCall(
                userId,
                userName,
                userAvatar,
                recipientId,
                chatId,
                'video'
            );

            setCurrentCallId(callId);
            setVideoRoomUrl(roomUrl);
            setShowVideoCall(true);

            const unsubscribe = subscribeToCallStatus(callId, (callData) => {
                if (callData.status === 'declined') {
                    alert('Call was declined');
                    closeVideoCall();
                    unsubscribe();
                } else if (callData.status === 'accepted') {
                    unsubscribe();
                }
            });
        } catch (error) {
            console.error('Failed to start video call:', error);
        }
    };

    const closeVideoCall = () => {
        setShowVideoCall(false);
        setVideoRoomUrl(null);
        setCurrentCallId(null);
        setIsCalling(false);
    };

    const handleCancelCall = async () => {
        if (currentCallId) {
            await cancelCallService(currentCallId);
        }
        closeVideoCall();
    };

    const acceptCall = async () => {
        if (incomingCallData) {
            await acceptCallService(incomingCallData.id);
            setVideoRoomUrl(incomingCallData.roomUrl);
            setShowVideoCall(true);
            setShowIncomingCall(false);
            setIncomingCallData(null);
        }
    };

    const declineCall = async () => {
        if (incomingCallData) {
            await declineCallService(incomingCallData.id);
            setShowIncomingCall(false);
            setIncomingCallData(null);
        }
    };

    const toggleAiMode = () => {
        setIsAiMode(!isAiMode);
    };

    const handleClearChat = async () => {
        if (window.confirm('Are you sure you want to clear this chat? This cannot be undone.')) {
            try {
                await clearChat(chatId);
                setShowOptions(false);
            } catch (error) {
                console.error('Error clearing chat:', error);
            }
        }
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewMessage(prev => `${prev} [Attached: ${file.name}]`);
        }
    };

    const onEmojiClick = (emojiObject) => {
        setNewMessage(prev => prev + emojiObject.emoji);
    };

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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderAvatar = (userData) => {
        const avatar = userData?.avatar || userData?.photoURL;
        if (avatar && typeof avatar === 'string' && (avatar.startsWith('http') || avatar.startsWith('/'))) {
            return <img src={avatar} alt={userData?.name || 'User'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />;
        }
        return avatar || <span className="material-icons-outlined">person</span>;
    };

    return (
        <div className="chat-window">
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
                    <button className="chat-action-btn" title="Voice Call" onClick={startVideoCall}>
                        <span className="material-symbols-outlined">call</span>
                    </button>
                    <button className="chat-action-btn" title="Video Call" onClick={startVideoCall}>
                        <span className="material-symbols-outlined">videocam</span>
                    </button>
                    <div className="chat-options-container" ref={optionsRef}>
                        <button
                            className="chat-action-btn"
                            title="More Options"
                            onClick={() => setShowOptions(!showOptions)}
                        >
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                        {showOptions && (
                            <div className="chat-options-menu">
                                <button className="chat-option-item danger" onClick={handleClearChat}>
                                    <span className="material-symbols-outlined">delete</span>
                                    Clear Chat
                                </button>
                            </div>
                        )}
                    </div>
                    <button className="chat-action-btn" onClick={onClose} title="Close">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </div>

            {showVideoCall && (
                <div className="video-call-overlay">
                    <VideoCall
                        roomUrl={videoRoomUrl}
                        onLeave={closeVideoCall}
                        participantName={user.name || 'User'}
                        isCalling={isCalling}
                        onCancel={handleCancelCall}
                    />
                </div>
            )}

            {showIncomingCall && incomingCallData && !showVideoCall && (
                <IncomingCall
                    callerName={incomingCallData.callerName || 'Someone'}
                    callerAvatar={incomingCallData.callerAvatar}
                    onAccept={acceptCall}
                    onDecline={declineCall}
                />
            )}

            {!recipientPresence.online && (
                <div className="offline-notice">
                    <span className="material-icons-outlined">mark_email_read</span>
                    {recipient?.name || 'User'} is offline. They'll be notified when online.
                </div>
            )}

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="chat-empty">
                        <span className="material-icons-outlined">chat_bubble_outline</span>
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
                                <div className="message-time">
                                    <span>{formatTime(msg.timestamp)}</span>
                                    {msg.senderId === (user.uid || user.id) && (
                                        <span className="material-symbols-outlined message-status">done_all</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSend}>
                <div className="chat-input-container">
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        className="chat-input-btn"
                        title="Attachments"
                        onClick={handleFileClick}
                    >
                        <span className="material-symbols-outlined">attach_file</span>
                    </button>
                    <button
                        type="button"
                        className={`chat-input-btn ai-btn ${isAiMode ? 'active' : ''}`}
                        title="Ask GuruAI"
                        onClick={toggleAiMode}
                    >
                        <span className="material-symbols-outlined">smart_toy</span>
                    </button>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={sending}
                    />
                    <div className="emoji-picker-container" ref={emojiPickerRef}>
                        {showEmojiPicker && (
                            <div className="emoji-picker-popup">
                                <EmojiPicker
                                    onEmojiClick={onEmojiClick}
                                    theme="dark"
                                    width={300}
                                    height={400}
                                />
                            </div>
                        )}
                        <button
                            type="button"
                            className={`chat-input-btn emoji-btn ${showEmojiPicker ? 'active' : ''}`}
                            title="Emoji"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <span className="material-symbols-outlined">sentiment_satisfied</span>
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="chat-send-btn"
                        disabled={!newMessage.trim() || sending}
                    >
                        {sending ? (
                            <span className="material-symbols-outlined animate-spin">refresh</span>
                        ) : (
                            <span className="material-symbols-outlined">send</span>
                        )}
                    </button>
                </div>
                <div className="chat-input-hints">
                    <p>Press <strong>Enter</strong> to send</p>
                    <p>GuruAI Assist is <strong>{isAiMode ? 'Active' : 'Off'}</strong></p>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;
