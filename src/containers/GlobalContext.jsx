"use client";
import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from "usehooks-ts";
import { useEffect } from 'react';

const GlobalContext = createContext();

export const clearLocalStorage = () => {
    localStorage.clear();
}


export const GlobalContextProvider = ({ children }) => {
    // Put all of the global variables here
    const [user, setUser] = useLocalStorage("user", null);
    const [message, setMessage] = useState("message", "Hello World");

    const [theme, setTheme] = useLocalStorage("theme", "dark");
    
    const changeTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    }

    useEffect(() => {
        if (theme === "dark")
            document.documentElement.classList.add("dark");
        else
            document.documentElement.classList.remove("dark");
    }, [theme]);


    return (
        // Pass the global variables here vvvvvvvvvvvvvv
        <GlobalContext.Provider value={{ user, setUser, message, setMessage, theme, changeTheme, clearLocalStorage }}>
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
