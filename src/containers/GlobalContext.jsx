"use client";
import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect } from 'react';

const GlobalContext = createContext();

export const clearLocalStorage = () => {
    localStorage.clear();
}

export const GlobalContextProvider = ({ children }) => {
    // Put all of the global variables here
    const [user, setUser] = useLocalStorage("Mike Tyson");
    const [message, setMessage] = useState("Hello World");

    const [theme, setTheme] = useLocalStorage("light");
    const themeMode = () => {
        setTheme(theme === "light" ? "dark" : "light");
    }



    useEffect(() => {
        if (theme === "dark")
            document.documentElement.className = "dark";
        else
            document.documentElement.className = "";
    }, [theme]);


    return (
        // Pass the global variables here vvvvvvvvvvvvvv
        <GlobalContext.Provider value={{ user, setUser, message, setMessage, theme, themeMode }}>
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
