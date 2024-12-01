"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useGlobalContext } from '@/containers/GlobalContext';
import { Input } from '@/components/ui/input';
import { handleUsername, handleRequirments, meetRequirments, handlePassword, handlePassword2 } from "./utils"
import { colors, apiFetch } from '@/lib/utils';
import Avatar from '@/components/boringAvatars/index.js'
import { toast } from "sonner"

export const SettingsProfile = () => {
    const { user, setUser, setCurrentProject } = useGlobalContext();
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
            setUsernames(res1.data);
            // fetch emails
            const res2 = await apiFetch("/users/get/email", { method: "GET" })
            setEmails(res2.data);
        }
        fetchUsernames();
    }, [])

    const handleSave = async () => {
        // check if requirements are met 
        if (!meetRequirments(userReq))
            return toast("Please fill out all fields");
        if (newUser === user)
            return toast("No changes made");
        const res = await apiFetch("/users/update", { method: "POST", body: JSON.stringify(newUser) });
        setUser(newUser);
        toast(res.message);
    }

    const handleSignOut = () => {
        toast("Signed Out");
        setUser(null);
        setCurrentProject(-1);
    }

    const handleDelete = async () => {
        const res = await apiFetch("/users/delete", { method: "POST", body: JSON.stringify(user) });
        setUser(null);
        toast(res.message);
    }

    if (!user)
        return <div>loading</div>

    return (
        <div className="flex flex-col w-full h-full items-center justify-center space-y-5">
            <div className="flex w-full  items-center justify-evenly">
                <div className="flex flex-col">
                    <Input
                        className="color-input"
                        placeholder={user.username}
                        onChange={(e) => handleUsername(e, userReq, setUserReq, newUser, setNewUser, usernames)}
                    />
                    {handleRequirments(userReq, true)}
                    <Input className="color-input" placeholder={user.email} type="email" />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Avatar name={newUser.username} className="w-32 h-32 avatar" colors={colors} />
                </div>
            </div>
            <div className="flex items-center justify-evenly w-full">
                <button className="btn" onClick={handleSave}>
                    Save
                </button>
                <button className="btn" onClick={handleSignOut}>
                    Sign Out
                </button>
                <button className="btn" onClick={handleDelete}>
                    Delete Account
                </button>
            </div>
        </div >
    )
}

export const SettingsAccount = () => {
    const { user, setUser, changeTheme } = useGlobalContext();
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
            return toast("Please fill out all fields");
        if (newUser === user)
            return toast("No changes made");
        const res = await apiFetch("/users/update", { method: "POST", body: JSON.stringify(newUser) });
        setUser(newUser);
        toast({ description: res.message });
    }

    return (
        <div className="flex flex-col w-full h-full items-center justify-center  space-x-2">
            <Input
                className="color-input min-w-96"
                placeholder={user.name}
                type="text"
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <div className="flex w-full items-center justify-center px-9">
                <div className="flex flex-col items-center w-full">
                    <Input
                        className="color-input"
                        placeholder="password"
                        type="password"
                        onChange={(e) => handlePassword(e, setPassReq, newUser, setNewUser)}
                    />
                    <Input
                        className="color-input"
                        placeholder="Confirm password"
                        type="password"
                        onChange={(e) => handlePassword2(e, setPassReq, newUser, setNewUser)}
                    />
                    {handleRequirments(passReq, true)}
                </div>
                <div className="flex flex-col items-center h-full pt-2 w-full space-y-6">
                    <button className="btn" onClick={handleSave}>
                        Save
                    </button>
                    <input
                        type="checkbox"
                        className="toggle dark:[--tglbg:black] [--tglbg:white] border-0 bg-prime hover:bg-prime outline outline-offset-2 dark:outline-white outline-slate-300 outline-2 toggle-md"
                        onClick={changeTheme}
                    />
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
