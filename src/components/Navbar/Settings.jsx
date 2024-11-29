"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useGlobalContext } from '@/containers/GlobalContext';
import { Input } from '@/components/ui/input';
import { handleUsername, handleRequirments, inputCSS, meetRequirments, handlePassword, handlePassword2 } from "./utils"
import { colors, apiFetch, cn } from '@/lib/utils';
import Avatar from '@/components/boringAvatars/index.js'
import { useToast } from "@/components/hooks/use-toast"

export const SettingsProfile = () => {
    const { user, setUser, changeTheme } = useGlobalContext();
    const { toast } = useToast();
    const [newUser, setNewUser] = useState(user);

    useEffect(() => {
        setNewUser(user);
    }, [user])



    const [userReq, setUserReq] = useState({
        "Email is unique": true,
        "Username is unique": true,
        "Must not contain profanity": true,
        "Must be at least 3 characters": true,
    });

    // Fetch usernames and emails
    const [usernames, setUsernames] = useState([]);
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        const fetchUsernames = async () => {
            // fetch usernames
            const res1 = await apiFetch("/users/get/username", { method: "GET" })
            setUsernames(res1);
            // fetch emails
            const res2 = await apiFetch("/users/get/email", { method: "GET" })
            setEmails(res2);
        }
        fetchUsernames();
    }, [])

    const handleSave = async () => {
        // check if requirements are met 
        if (!meetRequirments(userReq))
            return toast({ description: "Please fill out all fields" });
        if (newUser === user)
            return toast({ description: "No changes made" });
        const res = await apiFetch("/users/update", { method: "POST", body: JSON.stringify(newUser) });
        setUser(newUser);
        toast({ description: res.message });
    }

    const handleSignOut = () => {
        setUser(null);
        toast({ description: "Signed Out" });
    }
    if (!user)
        return <div>loading</div>

    return (
        <div className="flex flex-col w-full h-full items-center justify-center space-y-5">
            <div className="flex w-full  items-center justify-evenly">
                <div className="flex flex-col">
                    <Input
                        className={inputCSS}
                        placeholder={user.username}
                        onChange={(e) => handleUsername(e, userReq, setUserReq, newUser, setNewUser, usernames)}
                    />
                    {handleRequirments(userReq, true)}
                    <Input className={inputCSS} placeholder={user.email} type="email" />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Avatar name={newUser.username} className="w-32 h-32" colors={colors} />
                </div>
            </div>
            <div className="flex items-center justify-evenly w-full">
                <button
                    className="smooth rounded-lg px-7 py-2 border-2 dark:border-white border-slate-300 dark:hover:bg-white hover:border-slate-300 hover:text-prime"
                    onClick={handleSave}
                >
                    Save
                </button>
                <button
                    className="smooth rounded-lg px-7 py-2 border-2 dark:border-white border-slate-300 dark:hover:bg-white hover:border-slate-300 hover:text-prime"
                    onClick={handleSignOut}
                >
                    Sign Out
                </button>
            </div>
        </div >
    )
}

export const SettingsAccount = () => {
    const { user, setUser, changeTheme } = useGlobalContext();
    const { toast } = useToast();
    const [newUser, setNewUser] = useState(user);

    useEffect(() => {
        setNewUser(user);
    }, [user])


    // Rerquirments for password
    const [passReq, setPassReq] = useState({
        "Must be at least 1 letter": false,
        "Must be at least 1 number": false,
        "Must be at least 12 characters": false,
        "Passwords must match": false,
    });

    const [userReq, setUserReq] = useState({
        "Email is unique": true,
    });


    const handleSave = async () => {
        // check if requirements are met 
        if (!meetRequirments(passReq))
            return toast({ description: "Please fill out all fields" });
        if (newUser === user)
            return toast({ description: "No changes made" });
        const res = await apiFetch("/users/update", { method: "POST", body: JSON.stringify(newUser) });
        setUser(newUser);
        toast({ description: res.message });
    }

    return (
        <div className="flex flex-col w-full h-full items-center justify-center  space-x-2">
            <Input
                className={cn(inputCSS, "min-w-96")}
                placeholder={user.name}
                type="text"
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <div className="flex w-full items-center justify-center px-9">
                <div className="flex flex-col items-center w-full">
                    <Input
                        className={inputCSS}
                        placeholder="password"
                        type="password"
                        onChange={(e) => handlePassword(e, setPassReq, newUser, setNewUser)}
                    />
                    <Input
                        className={inputCSS}
                        placeholder="Confirm password"
                        type="password"
                        onChange={(e) => handlePassword2(e, setPassReq, newUser, setNewUser)}
                    />
                    {handleRequirments(passReq, true)}
                </div>
                <div className="flex flex-col items-center h-full w-full space-y-4">
                    <label htmlFor="theme" className="text-lg">Change Theme</label>
                    <input
                        id="theme"
                        type="checkbox"
                        className="toggle dark:[--tglbg:black] [--tglbg:white] border-0 bg-prime hover:bg-prime outline outline-offset-2 dark:outline-white outline-slate-300 outline-2 toggle-md"
                        onClick={changeTheme}
                    />
                    <button
                        className="smooth rounded-lg px-7 py-2 mt-4 border-2 dark:border-white border-slate-300 dark:hover:bg-white hover:border-slate-300 hover:text-prime"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>



        </div>
    )
}


export const SettingsEducation = () => {
    return (
        <div>
        </div>
    )
}
