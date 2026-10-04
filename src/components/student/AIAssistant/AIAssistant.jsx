/* ==============================
   AI Assistant Component - GuruAI Page Container
   Wrapper component for the GuruAI chat interface,
   provides layout and imports the main AI chat module
   ============================== */
import React from 'react'
import ContextProvider from './GuruAI/Context'
import Main from './GuruAI/Main/Main'
import './AIAssistant.css'

const AIAssistant = () => {
    return (
        <ContextProvider>
            <Main />
        </ContextProvider>
    );
};

export default AIAssistant
