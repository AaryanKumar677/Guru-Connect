import { createContext, useState } from "react";
import { sendToGemini, incrementUsage } from "../../../../services/geminiService";

export const Context = createContext();

const ContextProvider = (props) => {

    const [conversations, setConversations] = useState([]);
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState(null);
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")
    const [sentImage, setSentImage] = useState(null);

    const [currentChatId, setCurrentChatId] = useState(null);

    function delayPara(index, nextWord) {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 75 * index);
    }

    const onSent = async (prompt, imageFile = null) => {
        let finalPrompt = prompt !== undefined ? prompt : input;

        const chatId = currentChatId || Date.now().toString();

        // Educational prompt enhancements
        if (finalPrompt.includes("exam stress") || finalPrompt.includes("exam anxiety")) {
            finalPrompt = "Provide specific techniques for managing exam stress and test anxiety. Include study strategies, relaxation techniques during exams, and mindset tips. Focus on practical actionable advice.";
        }
        else if (finalPrompt.includes("help me learn") || finalPrompt.includes("understand")) {
            finalPrompt = `Help me understand this topic step by step: ${finalPrompt}`;
        }

        const userMessage = {
            type: "user",
            text: finalPrompt,
            image: imageFile ? URL.createObjectURL(imageFile) : null,
            timestamp: new Date().toLocaleTimeString(),
            chatId: chatId,
        };

        // Placeholder AI message for loading animation
        const loadingMessage = {
            type: 'ai',
            text: '',
            timestamp: new Date().toLocaleTimeString(),
            chatId: chatId,
            isLoading: true
        };

        setResultData("");
        setLoading(true);
        setShowResult(true);

        setRecentPrompt({
            text: prompt !== undefined ? prompt : input,
            image: imageFile ? URL.createObjectURL(imageFile) : null
        });

        if (!currentChatId) {
            // NEW CHAT: Create conversation with all messages at once
            setCurrentChatId(chatId);
            setConversations(prev => [
                ...prev,
                {
                    id: chatId,
                    title: finalPrompt.slice(0, 20),
                    messages: [userMessage, loadingMessage]
                }
            ]);
        } else {
            // EXISTING CHAT: Add messages to existing conversation
            setConversations((prev) =>
                prev.map((chat) =>
                    chat.id === chatId
                        ? {
                            ...chat,
                            messages: [...chat.messages, userMessage, loadingMessage]
                        }
                        : chat
                )
            );
        }

        let response;
        try {
            console.log('🚀 Sending to Gemini API...');

            // Format history for geminiService (use current messages without the loading placeholder)
            const conversationHistory =
                conversations.find((c) => c.id === chatId)?.messages
                    .filter(msg => !msg.isLoading && msg.text && msg.text.trim() !== "")
                    .map((msg) => ({
                        type: msg.type === "user" ? "user" : "bot",
                        content: msg.text,
                    })) || [];

            // Use GuruConnect's geminiService
            response = await sendToGemini(finalPrompt, conversationHistory);
            console.log('✅ Got response from API:', response?.substring(0, 100) + '...');

            // Track usage
            incrementUsage();

            const aiResponse = {
                type: 'ai',
                text: response,
                timestamp: new Date().toLocaleTimeString(),
                chatId: chatId,
                isLoading: false
            };

            // Replace the placeholder AI message with the actual response
            setConversations((prev) =>
                prev.map((chat) =>
                    chat.id === chatId
                        ? {
                            ...chat,
                            messages: chat.messages.map((msg, idx) =>
                                idx === chat.messages.length - 1 && msg.isLoading
                                    ? aiResponse
                                    : msg
                            )
                        }
                        : chat
                )
            );

            let responseArray = response.split('**');
            let newArray = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newArray += responseArray[i]
                }
                else {
                    newArray += "<b>" + responseArray[i] + "</b>"
                }
            }
            responseArray = newArray.split('*').join("</br>").split(" ");
            for (let i = 0; i < responseArray.length; i++) {
                const nextWord = responseArray[i];
                delayPara(i, nextWord + " ")
            }
        } catch (error) {
            console.error("Error:", error);
            const errorResponse = "Sorry, there was an error processing your request. Please try again.";

            const aiResponse = {
                type: 'ai',
                text: errorResponse,
                timestamp: new Date().toLocaleTimeString(),
                chatId: chatId,
                isLoading: false
            };

            // Replace the placeholder AI message with the error response
            setConversations((prev) =>
                prev.map((chat) =>
                    chat.id === chatId
                        ? {
                            ...chat,
                            messages: chat.messages.map((msg, idx) =>
                                idx === chat.messages.length - 1 && msg.isLoading
                                    ? aiResponse
                                    : msg
                            )
                        }
                        : chat
                )
            );

            setResultData(errorResponse);
        }

        setLoading(false);
        setInput("")
        setSentImage(null);
    };

    const newChat = () => {
        const chatId = Date.now().toString();
        const newConversation = {
            id: chatId,
            title: "New Chat",
            messages: []
        };

        setConversations(prev => [...prev, newConversation]);
        setCurrentChatId(chatId);
        setLoading(false);
        setShowResult(false);
        setSentImage(null);
    };

    const contextValue = {
        conversations,
        setConversations,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        setLoading,
        resultData,
        input,
        setInput,
        newChat,
        sentImage,
        setSentImage,
        currentChatId,
        setCurrentChatId
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
