import React, { useContext, useState, useEffect, useRef } from 'react'
import './Main.css'
import { assets } from '../../../../../assets/guruai/assets'
import { Context } from '../Context'
import MarkdownIt from "markdown-it";
import { useAuth } from '../../../../../App';

const Main = () => {
    const { conversations, currentChatId, onSent, setInput, input, loading, showResult, newChat } = useContext(Context);
    const { user } = useAuth(); // Get user from auth context
    const userAvatar = user?.photoURL || assets.user_icon; // Use profile picture or fallback
    const currentChat = conversations.find(chat => chat.id === currentChatId);
    const currentMessages = currentChat ? currentChat.messages : [];
    const md = new MarkdownIt({ html: true });

    const [selectedImage, setSelectedImage] = useState(null);
    const [isAtBottom, setIsAtBottom] = useState(true); // Track scroll position
    const fileInputRef = useRef(null);
    const resultRef = useRef(null);

    // Auto-scroll to bottom when messages change or loading starts
    useEffect(() => {
        if (resultRef.current) {
            resultRef.current.scrollTo({
                top: resultRef.current.scrollHeight,
                behavior: 'smooth'
            });
            setIsAtBottom(true);
        }
    }, [currentMessages, loading]);

    // Track scroll position to toggle arrow direction
    const handleScroll = () => {
        if (resultRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = resultRef.current;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 50;
            console.log('Scroll:', { scrollTop, clientHeight, scrollHeight, atBottom, isAtBottom }); // Debug
            if (atBottom !== isAtBottom) {
                setIsAtBottom(atBottom);
            }
        }
    };

    // Scroll to top or bottom based on current position
    const handleScrollButton = () => {
        if (resultRef.current) {
            if (isAtBottom) {
                // At bottom, scroll to top
                resultRef.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                // At top/middle, scroll to bottom
                resultRef.current.scrollTo({
                    top: resultRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && (input.trim() !== '' || selectedImage)) {
            handleSend();
        }
    };

    const handleCardClick = async (promptText) => {
        setInput("");
        onSent(promptText, null);
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleSend = () => {
        if (input.trim() !== '' || selectedImage) {
            onSent(input, selectedImage);
            setInput("");
            setSelectedImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className='mannmitra-main'>
            {/* Nav bar with title */}
            <div className="mannmitra-nav">
                <div className="nav-branding">
                    <img src="/assets/icons/guru-ai.png" alt="GuruAI" className="nav-logo" />
                    <div className="nav-text-container">
                        <span className="guru-text-gradient">GuruAI</span>
                        <span className="nav-subtitle">AI Learning Assistant</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={userAvatar} alt="User" />
                </div>
            </div>

            {/* Main content area */}
            <div className="mannmitra-container">
                {currentMessages.length > 0 ? (
                    <>
                        <div className="mannmitra-result" ref={resultRef} onScroll={handleScroll}>
                            {currentMessages.map((msg, index) => {
                                const cleanText = msg.text
                                    ? msg.text
                                        .replace(/\*\*• (.*?)\*\*/g, "### • $1")
                                        .replace(/• /g, "- ")
                                    : "";

                                return (
                                    <div key={index} className={msg.type === 'user' ? 'user-message-box' : 'ai-message-box'}>
                                        <img src={msg.type === 'user' ? userAvatar : assets.gemini_icon} alt="" />
                                        <div className="message">
                                            {msg.type === 'ai' && (loading || msg.isLoading) && !msg.text ? (
                                                <div className="loader">
                                                    <hr className="animated-bg" />
                                                    <hr className="animated-bg" />
                                                    <hr className="animated-bg" />
                                                </div>
                                            ) : (
                                                msg.text && (
                                                    <div
                                                        className="message-text"
                                                        dangerouslySetInnerHTML={{ __html: md.render(cleanText) }}
                                                    ></div>
                                                )
                                            )}
                                            {msg.image && <img src={msg.image} alt="sent" className="sent-image" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>


                        {/* Floating scroll to bottom button - only visible when NOT at bottom */}
                        {currentMessages.length > 0 && !isAtBottom && (
                            <button
                                className="scroll-nav-btn"
                                onClick={() => {
                                    if (resultRef.current) {
                                        resultRef.current.scrollTo({
                                            top: resultRef.current.scrollHeight,
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
                                title="Scroll to bottom"
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        )}
                    </>
                ) : (
                    <div className="mannmitra-landing">
                        <div className="mannmitra-greet">
                            <p><span>Hello, buddy</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="mannmitra-cards">
                            <div className="mannmitra-card" onClick={() => handleCardClick("Help me understand a topic step by step")}>
                                <p>Help me understand a topic step by step</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="mannmitra-card" onClick={() => handleCardClick("Explain this concept in simple terms")}>
                                <p>Explain this concept in simple terms</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="mannmitra-card" onClick={() => handleCardClick("Help me solve this problem")}>
                                <p>Help me solve this problem</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="mannmitra-card" onClick={() => handleCardClick("Suggest study strategies for exams")}>
                                <p>Suggest study strategies for exams</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected image preview */}
            {
                selectedImage && (
                    <div className="mannmitra-preview">
                        <div className="image-preview">
                            <img src={URL.createObjectURL(selectedImage)} alt="Preview" />
                            <button onClick={removeImage} className="remove-image-btn">×</button>
                        </div>
                    </div>
                )
            }

            {/* Input area - fixed at bottom */}
            <div className="mannmitra-bottom">
                <div className="mannmitra-search-box">
                    <div
                        className="new-chat-btn"
                        onClick={newChat}
                        title="New Chat"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 6V18" stroke="#888" strokeWidth="2" strokeLinecap="round" /> {/* Vertical */}
                            <path d="M7 12H17" stroke="#888" strokeWidth="2" strokeLinecap="round" /> {/* Horizontal - slightly shorter */}
                        </svg>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        id="mannmitra-file-input"
                    />

                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text"
                        placeholder="Ask GuruAI anything..."
                        onKeyPress={handleKeyPress}
                    />
                    <div className="mannmitra-actions">
                        <img
                            src={assets.gallery_icon}
                            alt="Upload"
                            onClick={() => document.getElementById('mannmitra-file-input').click()}
                        />
                        <img src={assets.mic_icon} alt="Voice" />
                        {(input || selectedImage) &&
                            <img onClick={handleSend} src={assets.send_icon} alt="Send" />
                        }
                    </div>
                </div>
                <p className="mannmitra-info">
                    GuruAI may display inaccurate info, so double-check its responses.
                </p>
            </div>
        </div >
    )
}

export default Main
