import { useState, useRef, useEffect } from 'react'
import { useAuth, useToast } from '../../../App'
import { sendToGemini, isApiConfigured, getRemainingQueries, incrementUsage, canMakeQuery } from '../../../services/geminiService'
import './AIAssistant.css'

const AIAssistant = () => {
    const { user } = useAuth()
    const { showToast } = useToast()
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)
    const fileInputRef = useRef(null)

    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [remainingQueries, setRemainingQueries] = useState(getRemainingQueries())

    // Get user info for personalization
    const firstName = user?.name?.split(' ')[0] || user?.fullName?.split(' ')[0] || 'Student'
    const collegeName = user?.college || 'Your College'

    // Educational quick actions based on student context
    const getEducationalActions = () => [
        {
            icon: '📚',
            label: 'Help me learn',
            prompt: 'Help me understand a topic step by step'
        },
        {
            icon: '📝',
            label: `Study ${collegeName.split(' ')[0]} syllabus`,
            prompt: `What are the key topics I should focus on for ${collegeName} curriculum?`
        },
        {
            icon: '🧮',
            label: 'Solve problem',
            prompt: 'Help me solve this problem: '
        },
        {
            icon: '✍️',
            label: 'Explain concept',
            prompt: 'Explain this concept in simple terms: '
        }
    ]

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

    const handleQuickAction = (action) => {
        setInputValue(action.prompt)
        inputRef.current?.focus()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            showToast(`File selected: ${file.name}`, 'success')
            // Future implementation: Handle file upload logic here
        }
    }

    const suggestedQuestions = [
        "Explain the Pythagorean theorem",
        "What is photosynthesis?",
        "How do I solve quadratic equations?",
        "Explain Newton's laws of motion"
    ]

    // Landing Screen - show when no messages exist
    if (messages.length === 0) {
        return (
            <div className="guru-ai-landing">
                <div className="landing-content">
                    {/* Greeting with Sparkle */}
                    <div className="greeting-section">
                        <span className="sparkle-icon">✦</span>
                        <h2 className="greeting-text">Hi {firstName}</h2>
                    </div>

                    {/* Main Heading */}
                    <h1 className="tagline">Where should we start?</h1>

                    {/* Input Box */}
                    <div className="landing-input-container">
                        <form onSubmit={handleSubmit} className="landing-input-form">
                            <button
                                type="button"
                                className="add-btn"
                                onClick={() => fileInputRef.current?.click()}
                                title="Add files, photos, etc."
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask GuruAI anything..."
                                className="landing-input"
                            />
                            <button type="button" className="voice-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Quick Action Pills */}
                    <div className="quick-actions">
                        {getEducationalActions().map((action, index) => (
                            <button
                                key={index}
                                className="action-pill"
                                onClick={() => handleQuickAction(action)}
                            >
                                <span className="action-icon">{action.icon}</span>
                                <span className="action-label">{action.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Queries Remaining */}
                    <div className="queries-indicator">
                        {remainingQueries} queries remaining today
                    </div>
                </div>
            </div>
        )
    }

    // Chat Interface - show when messages exist
    return (
        <div className="ai-assistant-page">
            {/* Header */}
            <div className="ai-page-header">
                <div className="ai-header-info">
                    <div className="ai-avatar-large">
                        <img src="/assets/icons/guru-ai.png" alt="GuruAI" width="32" height="32" />
                    </div>
                    <div>
                        <h1 className="ai-title guru-text-gradient">GuruAI</h1>
                        <p className="ai-subtitle">AI Learning Assistant</p>
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
                                <div className="message-avatar">
                                    <img src="/assets/icons/guru-ai.png" alt="AI" width="24" height="24" />
                                </div>
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
                            <div className="message-avatar">
                                <img src="/assets/icons/guru-ai.png" alt="AI" width="24" height="24" />
                            </div>
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
                        <button
                            type="button"
                            className="add-btn"
                            onClick={() => fileInputRef.current?.click()}
                            title="Add files"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        <textarea
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask GuruAI anything..."
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
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
