import React from 'react'
import ContextProvider from './MannMitra/Context'
import Main from './MannMitra/Main/Main'
import './AIAssistant.css'

const AIAssistant = () => {
    return (
        <ContextProvider>
            <Main />
        </ContextProvider>
    );
};

export default AIAssistant
