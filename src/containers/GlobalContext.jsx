"use client";
import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from "usehooks-ts";

const GlobalContext = createContext();

export const clearLocalStorage = () => {
    localStorage.clear();
}

export const GlobalContextProvider = ({ children }) => {
    // Put all of the global variables here
    const [user, setUser] = useLocalStorage("name", "Mike Tyson", { initializeWithValue: false });
    const [message, setMessage] = useState("Hello World");

    const [theme, setTheme] = useLocalStorage("theme", "light", { initializeWithValue: false });


    return (
        // Pass the global variables here vvvvvvvvvvvvvv
        <GlobalContext.Provider value={{ user, setUser, message, setMessage, theme, setTheme }}>
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
