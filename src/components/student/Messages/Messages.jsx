// Messages Page - Chat interface for students 
import React, { useState } from 'react';
import { useAuth } from '../../../App';
import ChatList from '../../common/Chat/ChatList';
import ChatWindow from '../../common/Chat/ChatWindow';
import './Messages.css';

const Messages = () => {
    const { user } = useAuth();
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedRecipientId, setSelectedRecipientId] = useState(null);

    const handleSelectChat = (chat, recipientId) => {
        setSelectedChat(chat);
        setSelectedRecipientId(recipientId);
    };

    const handleCloseChat = () => {
        setSelectedChat(null);
        setSelectedRecipientId(null);
    };

    return (
        <div className="messages-page">
            <div className="messages-header">
                <h1 className="page-title">Messages</h1>
                <p className="page-subtitle">Chat with your tutors</p>
            </div>

            <div className="messages-container">
                {/* Chat List */}
                <div className={`messages-sidebar ${selectedChat ? 'hidden-mobile' : ''}`}>
                    <ChatList onSelectChat={handleSelectChat} />
                </div>

                {/* Chat Window */}
                <div className={`messages-content ${!selectedChat ? 'hidden-mobile' : ''}`}>
                    {selectedChat ? (
                        <ChatWindow
                            chatId={selectedChat.id}
                            recipientId={selectedRecipientId}
                            onClose={handleCloseChat}
                        />
                    ) : (
                        <div className="no-chat-selected">
                            <span>💬</span>
                            <h3>Select a conversation</h3>
                            <p>Choose a chat from the sidebar to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
