"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from "usehooks-ts";

const GlobalContext = createContext();


export const clearLocalStorage = () => {
    localStorage.clear();
}


const useLocalState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        // This runs only on the client-side
        if (typeof window !== "undefined") {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        }
        return defaultValue; // Default value for SSR
    });

    useEffect(() => {
        // Sync the localStorage whenever the state changes
        if (typeof window !== "undefined") {
            localStorage.setItem(key, JSON.stringify(state));
        }
    }, [key, state]);

    return [state, setState]
}


export const GlobalContextProvider = ({ children }) => {
    // Gloval States
    // User Information
    const [user, setUser] = useLocalState("user", null)
    // Current Project
    const [currentProject, setCurrentProject] = useLocalState("currentProject", -1);
    // Theme
    const [theme, setTheme] = useLocalStorage("theme", "dark");
    const changeTheme = () => setTheme(theme === "light" ? "dark" : "light");
    useEffect(() => {
        if (!theme || theme === "dark")
            document.documentElement.classList.add("dark");
        else
            document.documentElement.classList.remove("dark");
    }, [theme]);
    // Return the global variables in this wrapper 
    return (
        // Pass the global variables here vvvvvvvvvvvvvv
        <GlobalContext.Provider value={{ user, setUser, theme, changeTheme, currentProject, setCurrentProject, clearLocalStorage }}>
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
