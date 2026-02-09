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
            <div className="messages-container">
                <div className={`messages-sidebar ${selectedChat ? 'hidden-mobile' : ''}`}>
                    <ChatList
                        onSelectChat={handleSelectChat}
                        selectedChatId={selectedChat?.id}
                    />
                </div>

                <div className={`messages-content ${!selectedChat ? 'hidden-mobile' : ''}`}>
                    {selectedChat ? (
                        <ChatWindow
                            chatId={selectedChat.id}
                            recipientId={selectedRecipientId}
                            onClose={handleCloseChat}
                        />
                    ) : (
                        <div className="no-chat-selected">
                            <div className="empty-icon-container">
                                <span className="material-icons-outlined main-icon">chat_bubble</span>
                                <div className="floating-icon video">
                                    <span className="material-icons-outlined">videocam</span>
                                </div>
                                <div className="floating-icon mic">
                                    <span className="material-icons-outlined">mic</span>
                                </div>
                            </div>
                            <h3>Select a conversation</h3>
                            <p>Choose a chat from the sidebar to start messaging, or search for a new tutor to connect with.</p>
                            <button className="start-chat-btn">
                                <span className="material-icons-outlined">add_comment</span>
                                Start New Chat
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
