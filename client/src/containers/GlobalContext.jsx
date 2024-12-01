"use client";
import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from "usehooks-ts";
import { useEffect } from 'react';

const GlobalContext = createContext();


const debug = true;

export const clearLocalStorage = () => {
    localStorage.clear();
}



export const GlobalContextProvider = ({ children }) => {
    // Put all of the global variables here
    const [user, setUser] = useLocalStorage("user", debug ? null : null);
    const [currentProject, setCurrentProject] = useLocalStorage("currentProject", -1);
    const [theme, setTheme] = useLocalStorage("theme", "dark");

    const changeTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    }

    useEffect(() => {
        if (!theme || theme === "dark")
            document.documentElement.classList.add("dark");
        else
            document.documentElement.classList.remove("dark");
    }, [theme]);


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
