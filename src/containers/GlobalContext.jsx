"use client";
import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    // Put all of the global variables here
    const [user, setUser] = useState("Mike Tyson");


    return (
        // Pass the global variables here vvvvvvvvvvvvvv
        <GlobalContext.Provider value={{ user, setUser }}>
            {children}
        </GlobalContext.Provider>
    );
}


export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context)
        throw new Error('useGlobalContext must be used within a GlobalContextProvider');
    return context;
}
