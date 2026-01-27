import { useState, useRef, useEffect } from 'react'
import { useAuth, useToast } from '../../../App'
import { sendToGemini, isApiConfigured, getRemainingQueries, incrementUsage, canMakeQuery } from '../../../services/geminiService'
import './AIAssistant.css'

const AIAssistant = () => {
    const { user } = useAuth()
    const { showToast } = useToast()
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: isApiConfigured()
                ? "Hello! I'm your AI learning assistant powered by Gemini. How can I help you today? 🤖"
                : "Hello! I'm your AI learning assistant. Note: Gemini API is not configured - using demo mode. Add VITE_GEMINI_API_KEY to .env for real AI responses. 🤖",
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [remainingQueries, setRemainingQueries] = useState(getRemainingQueries())

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!inputValue.trim() || isLoading) return

        if (!canMakeQuery()) {
            showToast('You have reached your daily limit. Upgrade for unlimited access!', 'warning')
            return
        }

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        const currentInput = inputValue
        setInputValue('')
        setIsLoading(true)

        try {
            let response

            if (isApiConfigured()) {
                // Use real Gemini API
                const history = messages.slice(1).map(m => ({
                    type: m.type,
                    content: m.content
                }))
                response = await sendToGemini(currentInput, history)
            } else {
                // Fallback demo responses
                await new Promise(resolve => setTimeout(resolve, 1500))
                const demoResponses = [
                    `That's a great question about "${currentInput.slice(0, 30)}..."!\n\nLet me explain this concept:\n\n**Key Points:**\n1. Start with understanding the fundamentals\n2. Apply the concept step by step\n3. Practice with examples\n\nWould you like me to elaborate on any of these points?`,
                    `I understand you're asking about "${currentInput.slice(0, 30)}...".\n\nHere's a step-by-step explanation:\n\n• First, consider the basic principles\n• Then, see how they connect\n• Finally, apply to your specific case\n\nShall I provide some practice problems?`,
                ]
                response = demoResponses[Math.floor(Math.random() * demoResponses.length)]
            }

            const botMessage = {
                id: Date.now(),
                type: 'bot',
                content: response,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, botMessage])
            incrementUsage()
            setRemainingQueries(getRemainingQueries())
        } catch (error) {
            console.error('AI Error:', error)
            showToast('Failed to get response. Please try again.', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEscalateToTutor = () => {
        showToast('Connecting you with a tutor...', 'info')
        // In real app, this would navigate to tutor booking with chat context
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    const suggestedQuestions = [
        "Explain the Pythagorean theorem",
        "What is photosynthesis?",
        "How do I solve quadratic equations?",
        "Explain Newton's laws of motion"
    ]

    return (
        <div className="ai-assistant-page">
            {/* Header */}
            <div className="ai-page-header">
                <div className="ai-header-info">
                    <div className="ai-avatar-large">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="ai-title">AI Learning Assistant</h1>
                        <p className="ai-subtitle">Powered by Gemini • Always here to help</p>
                    </div>
                </div>
                <div className="ai-header-actions">
                    <div className="queries-remaining">
                        <span className="queries-count">{remainingQueries}</span>
                        <span className="queries-label">queries left today</span>
                    </div>
                    <button className="btn btn-secondary" onClick={handleEscalateToTutor}>
                        👨‍🏫 Ask a Tutor
                    </button>
                </div>
            </div>

            {/* Chat Container */}
            <div className="ai-chat-container">
                {/* Messages */}
                <div className="ai-messages">
                    {messages.map((message) => (
                        <div key={message.id} className={`message ${message.type}`}>
                            {message.type === 'bot' && (
                                <div className="message-avatar">🤖</div>
                            )}
                            <div className="message-content">
                                <div className="message-bubble">
                                    {message.content.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                                <span className="message-time">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            {message.type === 'user' && (
                                <div className="message-avatar user">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message bot">
                            <div className="message-avatar">🤖</div>
                            <div className="message-content">
                                <div className="message-bubble typing">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length <= 1 && (
                    <div className="suggested-questions">
                        <p className="suggested-title">Try asking:</p>
                        <div className="suggested-list">
                            {suggestedQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    className="suggested-btn"
                                    onClick={() => setInputValue(q)}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <form className="ai-input-area" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <textarea
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything about your studies..."
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="send-btn"
                            disabled={!inputValue.trim() || isLoading}
                        >
                            {isLoading ? (
                                <span className="spinner"></span>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            )}
                        </button>
                    </div>
                    <p className="input-hint">Press Enter to send, Shift+Enter for new line</p>
                </form>
            </div>
        </div>
    )
}

export default AIAssistant
