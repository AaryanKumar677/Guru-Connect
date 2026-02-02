// Chat Panel Component - Floating chat UI that can be triggered from anywhere
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../App';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { getOrCreateChat } from '../../../services/firebaseService';
import './Chat.css';

const ChatPanel = ({ isOpen, onClose, initialRecipientId = null }) => {
    const { user } = useAuth();
    const [activeChat, setActiveChat] = useState(null);
    const [recipientId, setRecipientId] = useState(null);
    const [view, setView] = useState('list'); // 'list' or 'chat'

    const userId = user?.uid || user?.id;

    // If opened with a specific recipient, start chat with them
    useEffect(() => {
        if (initialRecipientId && userId) {
            handleStartChatWithUser(initialRecipientId);
        }
    }, [initialRecipientId, userId]);

    const handleStartChatWithUser = async (targetUserId) => {
        if (!userId) return;

        try {
            const chat = await getOrCreateChat(userId, targetUserId);
            setActiveChat(chat);
            setRecipientId(targetUserId);
            setView('chat');
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };

    const handleSelectChat = (chat, otherUserId) => {
        setActiveChat(chat);
        setRecipientId(otherUserId);
        setView('chat');
    };

    const handleBackToList = () => {
        setActiveChat(null);
        setRecipientId(null);
        setView('list');
    };

    const handleClose = () => {
        setActiveChat(null);
        setRecipientId(null);
        setView('list');
        onClose?.();
    };

    if (!isOpen) return null;

    return (
        <div className="chat-panel-overlay" onClick={handleClose}>
            <div className="chat-panel" onClick={(e) => e.stopPropagation()}>
                {view === 'list' ? (
                    <>
                        <div className="chat-panel-header">
                            <h3>Messages</h3>
                            <button className="btn btn-ghost btn-sm" onClick={handleClose}>
                                ✕
                            </button>
                        </div>
                        <div className="chat-panel-body">
                            <ChatList onSelectChat={handleSelectChat} />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="chat-panel-header">
                            <button className="btn btn-ghost btn-sm" onClick={handleBackToList}>
                                ← Back
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={handleClose}>
                                ✕
                            </button>
                        </div>
                        <ChatWindow
                            chatId={activeChat?.id}
                            recipientId={recipientId}
                            onClose={handleBackToList}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatPanel;

// Chat Context for global access
export const useChatPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [recipientId, setRecipientId] = useState(null);

    const openChat = (userId = null) => {
        setRecipientId(userId);
        setIsOpen(true);
    };

    const closeChat = () => {
        setIsOpen(false);
        setRecipientId(null);
    };

    return { isOpen, recipientId, openChat, closeChat };
};
